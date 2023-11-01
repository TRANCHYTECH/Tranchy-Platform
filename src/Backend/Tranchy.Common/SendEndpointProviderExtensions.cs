using MassTransit;

namespace Tranchy.Common;

public static class SendEndpointProviderExtensions
{
    public static async Task Send<T>(this ISendEndpointProvider sendEndpointProvider, T command, string queue, CancellationToken cancellationToken) where T : ICommand
    {
        var sendEndpoint = await sendEndpointProvider.GetSendEndpoint(new Uri($"queue:{queue}"));

        await sendEndpoint.Send(command, cancellationToken);
    }
}
