using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tranchy.Common
{
    public static class SendEndpointProviderExtensions
    {
        public static async Task Send<T>(this ISendEndpointProvider sendEndpointProvider, T command, string queue) where T : ICommand
        {
            var sendEndpoint = await sendEndpointProvider.GetSendEndpoint(new Uri($"queue:{queue}"));

            await sendEndpoint.Send(command);
        }
    }
}
