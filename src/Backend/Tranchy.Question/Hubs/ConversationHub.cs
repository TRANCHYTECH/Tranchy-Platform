using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Tranchy.Question.Hubs;

[Authorize]
public class ConversationHub : Hub
{
    private static readonly JsonSerializerOptions Options = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    // public async Task CreateEventV2(CreateEventMetadata metadata, string payload, [FromServices] ILogger<ConversationHub> logger)
    // {

    //     var @event = JsonSerializer.Deserialize<CreateQuestionEventRequest>(payload, Options);
    //     if (@event is not null)
    //     {
    //         string userId = GetUserId();
    //         var newQuestionEvent = @event.ToEntity(metadata.QuestionId, userId);
    //         await DB.InsertAsync(newQuestionEvent, cancellation: Context.ConnectionAborted);
    //         logger.CreatedQuestionEvent(newQuestionEvent.ID!, metadata.QuestionId, string.Empty);

    //         await Clients.Users(new[] { metadata.NotifiedUserId }).SendAsync("receiveEvent", newQuestionEvent, cancellationToken: Context.ConnectionAborted);
    //     }
    // }

    public async Task CreateEvent(string questionId, string payload, [FromServices] ILogger<ConversationHub> logger)
    {
        var @event = JsonSerializer.Deserialize<CreateQuestionEventRequest>(payload, Options);
        if (@event is not null)
        {
            string userId = GetUserId();
            var newQuestionEvent = @event.ToEntity(questionId, userId);
            await DB.InsertAsync(newQuestionEvent, cancellation: Context.ConnectionAborted);
            logger.CreatedQuestionEvent(newQuestionEvent.ID!, questionId, string.Empty);

            await Clients.All.SendAsync("receiveEvent", newQuestionEvent, cancellationToken: Context.ConnectionAborted);
        }
    }

    private string GetUserId() => GetClaim(ClaimTypes.NameIdentifier);

    private string GetClaim(string claimType)
    {
        var claim = Context?.User?.Claims.FirstOrDefault(c => string.Equals(c.Type, claimType, StringComparison.Ordinal));
        return claim?.Value ?? string.Empty;
    }
}
