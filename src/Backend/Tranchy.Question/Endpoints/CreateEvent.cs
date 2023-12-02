using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Common.Services;
using Microsoft.AspNetCore.SignalR;
using Tranchy.Question.Hubs;

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
            await hubContext.Clients.Users(new[] { input.Metadata.NotifiedUserId }).SendAsync("receiveEvent", newQuestionEvent.ToMobileModel(), token);
        }

        logger.CreatedQuestionEvent(newQuestionEvent.ID!, newQuestionEvent.QuestionId, newQuestionEvent.CreatedByUserId);

        return TypedResults.Ok<QuestionOutput>(new(newQuestionEvent.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder.MapPost("/{questionId}/event", Create)
            .WithName(nameof(CreateQuestionEvent))
            .WithTags("Question Action")
            .WithSummary("Create a question event")
            .WithOpenApi();
}
