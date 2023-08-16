using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Tranchy.Common;
using MassTransit;
using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Question.Commands;

namespace Tranchy.Question.Endpoints;

public record CreateQuestionInput(string Title);

public class CreateQuestion : IEndpoint
{
    public static async Task<Ok<QuestionOutput>> Create([FromBody] CreateQuestionInput input, [FromServices] QuestionModule module, [FromServices]MongoDbContext dbContext, [FromServices]ISendEndpointProvider sendEndpointProvider, [FromServices] IPublishEndpoint publishEndpoint)
    {
        var newQuestion = new Data.Question
        {
            Title = input.Title,
        };

        await dbContext.BeginTransaction(default);

        await DB.InsertAsync(newQuestion, dbContext.Session, default);

        await publishEndpoint.Publish(new QuestionCreated
        {
            Title = input.Title
        });

        VerifyQuestion command = new()
        {
            Title = input.Title
        };

        await sendEndpointProvider.Send(command, module.VerifyQuestionQueue);

        await dbContext.CommitTransaction(default);

        return TypedResults.Ok<QuestionOutput>(new(input.Title));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/", Create);
    }
}

