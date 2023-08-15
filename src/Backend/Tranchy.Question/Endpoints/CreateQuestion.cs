using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Tranchy.Common;
using Tranchy.Question.Data;
using MassTransit;
using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using MongoDB.Bson;
using Tranchy.Question.Consumers;
using Tranchy.Question.Commands;

namespace Tranchy.Question.Endpoints;

public record CreateQuestionInput(string Title);

public class CreateQuestion : IEndpoint
{
    public static async Task<Ok<QuestionOutput>> Create([FromBody] CreateQuestionInput input, [FromServices]MongoDbContext dbContext, [FromServices]ISendEndpointProvider sendEndpointProvider, [FromServices] IPublishEndpoint publishEndpoint)
    {
        var newQuestion = new Data.Question
        {
            ID = ObjectId.GenerateNewId().ToString(),
            Title = input.Title,
        };

        await dbContext.BeginTransaction(default);
        await DB.InsertAsync(newQuestion, dbContext.Session, default);
        await publishEndpoint.Publish(new QuestionCreated
        {
            Title = input.Title
        });

        var sendEndpoint = await sendEndpointProvider.GetSendEndpoint(new Uri("queue:Tranchy.Question.Command/NotifyAgencyQuestionLocal"));
        await sendEndpoint.Send(new VerifyQuestion
        {
            Title = input.Title
        });
        await dbContext.CommitTransaction(default);

        //using (var transaction = DB.Transaction())
        //{
        //    var newQuestion = new Data.Question
        //    {
        //        Title = input.Title,
        //    };

        //    await transaction.SaveAsync(new[] { newQuestion });

        //    await publishEndpoint.Publish(new QuestionCreated
        //    {
        //        Title = input.Title
        //    });

        //    try
        //    {
        //        await transaction.CommitAsync();
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }
        //}

        return TypedResults.Ok<QuestionOutput>(new(input.Title));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/", Create);
    }
}

