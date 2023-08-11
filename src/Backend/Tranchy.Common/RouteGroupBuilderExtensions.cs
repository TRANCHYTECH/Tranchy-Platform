using Tranchy.Common;

namespace Microsoft.AspNetCore.Routing;

public static class RouteGroupBuilderExtensions
{
    public static RouteGroupBuilder MapEndpoints<TModule>(this RouteGroupBuilder group) where TModule : class, IModule
    {
        var endpoints = typeof(TModule).Assembly.GetTypes().Where(t => t.IsClass && t.IsAssignableTo(typeof(IEndpoint)));

        foreach (var endpoint in endpoints)
        {
            var registerRoutesMethod = endpoint.GetMethod(nameof(IEndpoint.Register));
            registerRoutesMethod?.Invoke(null, new object[] { group });
        }

        return group;
    }
}

