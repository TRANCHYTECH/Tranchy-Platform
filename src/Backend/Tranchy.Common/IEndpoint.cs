using Microsoft.AspNetCore.Routing;

namespace Tranchy.Common
{
    public interface IEndpoint
    {
        abstract static void Register(RouteGroupBuilder routeGroupBuilder);
    }
}
