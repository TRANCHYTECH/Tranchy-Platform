using MassTransit.MongoDbIntegration;
using Microsoft.AspNetCore.SignalR;
using Tranchy.Common.Constants;
using Tranchy.Common.Services;
using Tranchy.Question.Events;
using Tranchy.Question.Hubs;

namespace Tranchy.Question.Endpoints.Mobile;

public class CreateQuestionEvent : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{questionId}/events", Create)
        .WithName("CreateQuestionEvent")
        .WithSummary("Create a question event")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<CreateQuestionEventResponse>, BadRequest<IDictionary<string, string[]>>>>
        Create(
            [FromRoute] string questionId,
            [FromBody] CreateQuestionEventRequest input,
            [FromServices] MongoDbContext dbContext,
            [FromServices] IPublishEndpoint publishEndpoint,
            [FromServices] ILogger<CreateQuestionEvent> logger,
            [FromServices] ITenant tenant,
            [FromServices] IHubContext<ConversationHub> hubContext,
            CancellationToken token)
    {
        var newQuestionEvent = input.ToEntity(questionId, tenant.UserId);

        // TODO: validation
        await dbContext.BeginTransaction(token);

        await DB.InsertAsync(newQuestionEvent, dbContext.Session, token);

        await publishEndpoint.Publish(new QuestionEventCreated { Id = newQuestionEvent.ID! }, token);

        await dbContext.CommitTransaction(token);

        if (input.Metadata.NotifiedUserId is not null)
        {
            await hubContext.Clients.Users(new[] { input.Metadata.NotifiedUserId })
                .SendAsync("receiveEvent", newQuestionEvent.ToMobileModel(), token);
        }

        logger.CreatedQuestionEvent(newQuestionEvent.ID, newQuestionEvent.QuestionId, newQuestionEvent.CreatedByUserId);

        return TypedResults.Ok(new CreateQuestionEventResponse { EventId = newQuestionEvent.ID });
    }
}
