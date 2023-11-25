using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Common.Services;
using Microsoft.AspNetCore.SignalR;
using Tranchy.Question.Hubs;

namespace Tranchy.Question.Endpoints;

public class CreateQuestionEvent : IEndpoint
{
    public static async Task<Results<Ok<MobileQuestionEvent>, BadRequest<IDictionary<string, string[]>>>> Create(
        [FromRoute] string questionId,
        [FromBody] CreateQuestionEventRequest input,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateQuestionEvent> logger,
        [FromServices] ITenant tenant,
        [FromServices] IHubContext<ConversationHub> hubContext,
        CancellationToken token
    )
    {
        var newQuestionEvent = input.ToEntity(questionId, tenant.UserId);

        // TODO: validation
        await dbContext.BeginTransaction(token);

        await DB.InsertAsync(newQuestionEvent, dbContext.Session, token);

        await publishEndpoint.Publish(new QuestionEventCreated { Id = newQuestionEvent.ID! }, token);

        await dbContext.CommitTransaction(token);

        if (input.Metadata.NotifiedUserId is not null)
        {
            //todo: fire and forget. https://www.meziantou.net/fire-and-forget-a-task-in-dotnet.htm#alternative-implemen-a5b499
            var mobileEvent = newQuestionEvent.ToMobileModel();
            await hubContext.Clients.Users(new[] { input.Metadata.NotifiedUserId }).SendAsync("receiveEvent", mobileEvent, token);
        }

        logger.CreatedQuestionEvent(newQuestionEvent.ID!, newQuestionEvent.QuestionId, newQuestionEvent.CreatedByUserId);

        return TypedResults.Ok(newQuestionEvent.ToMobileModel());
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/{questionId}/Event", Create)
            .WithName(nameof(CreateQuestionEvent));
    }
}
