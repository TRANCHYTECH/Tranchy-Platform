using Microsoft.AspNetCore.Routing;

namespace Tranchy.Common;

public interface IEndpoint
{
    static abstract void Register(RouteGroupBuilder routeGroupBuilder);
}
