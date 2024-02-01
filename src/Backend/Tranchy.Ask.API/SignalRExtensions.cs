using Tranchy.Question.Hubs;

namespace Tranchy.Ask.API;

public static class SignalRExtensions
{
    public static void RegisterHubService(this IServiceCollection services) => services.AddSignalR(options => options.DisableImplicitFromServicesParameters = true).AddAzureSignalR();

    public static void UseHubs(this IEndpointRouteBuilder app) => app.MapHub<ConversationHub>("conversation");
}
