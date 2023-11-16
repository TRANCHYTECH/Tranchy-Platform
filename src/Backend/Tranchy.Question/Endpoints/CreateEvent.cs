using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints;

public class CreateQuestionEvent : IEndpoint
{
    public static async Task<Results<Ok<QuestionOutput>, BadRequest<IDictionary<string, string[]>>>> Create(
        [FromRoute] string questionId,
        [FromBody] CreateQuestionEventRequest input,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateQuestionEvent> logger,
        [FromServices] ITenant tenant,
        CancellationToken token
    )
    {
        var newQuestionEvent = input.ToEntity(questionId, tenant.UserId);

        // TODO: validation
        await dbContext.BeginTransaction(token);

        await DB.InsertAsync(newQuestionEvent, dbContext.Session, token);

        await publishEndpoint.Publish(new QuestionEventCreated { Id = newQuestionEvent.ID! }, token);

        await dbContext.CommitTransaction(token);

        logger.CreatedQuestionEvent(newQuestionEvent.ID!, newQuestionEvent.QuestionId, newQuestionEvent.CreatedByUserId);

        return TypedResults.Ok<QuestionOutput>(new(newQuestionEvent.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/{questionId}/Event", Create)
            .WithName(nameof(CreateQuestionEvent));
    }
}
