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
using Tranchy.Question.Endpoints;
using Tranchy.Question.Commands;
using Tranchy.Question.Consumers;

namespace Tranchy.Question.Integrations.Endpoints;

public record CreateQuestionInput(string Title);

public class CreateQuestion : IEndpoint
{
    public static async Task<Ok<QuestionOutput>> Create(
        [FromBody] CreateQuestionInput input,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint)
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

        await sendEndpointProvider.Send(command, endpointNameFormatter.Consumer<VerifyQuestionConsumer>());

        await dbContext.CommitTransaction(default);

        return TypedResults.Ok<QuestionOutput>(new(input.Title));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/", Create).WithName("CreateQuestion");
    }
}

