using Tranchy.Question.Hubs;

namespace Tranchy.Ask.API;

public static class SignalRExtentions
{
    public static void RegisterHubService(this IServiceCollection services) => services.AddSignalR().AddAzureSignalR();

    public static void UseHubs(this IEndpointRouteBuilder app) => app.MapHub<ConversationHub>("conversation");
}
