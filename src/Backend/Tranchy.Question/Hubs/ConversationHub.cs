using Microsoft.AspNetCore.SignalR;

namespace Tranchy.Question.Hubs;

public class ConversationHub : Hub
{
    public Task BroadcastMessage(string message) =>
        Clients.All.SendAsync("receiveMessage", message, cancellationToken: default);

    public Task Echo(string name, string message) =>
        Clients.Client(Context.ConnectionId)
                .SendAsync("echo", name, $"{message} (echo from server)", cancellationToken: default);
}