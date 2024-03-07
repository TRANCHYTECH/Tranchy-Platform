using Microsoft.AspNetCore.Routing;
using Tranchy.Common.Constants;

namespace Tranchy.Common;

public static class RouteGroupBuilderExtensions
{
    public static RouteGroupBuilder MapMobileEndpoints<TModule>(this RouteGroupBuilder group)
        where TModule : class, IModule =>
        group.MapEndpointsInternal<TModule>(Tags.Mobile);

    public static RouteGroupBuilder MapBackOfficeEndpoints<TModule>(this RouteGroupBuilder group)
        where TModule : class, IModule =>
        group.MapEndpointsInternal<TModule>(Tags.BackOffice);

    public static RouteGroupBuilder MapIntegrationEndpoints<TModule>(this RouteGroupBuilder group)
        where TModule : class, IModule =>
        group.MapEndpointsInternal<TModule>(Tags.Integration);

    private static RouteGroupBuilder MapEndpointsInternal<TModule>(this RouteGroupBuilder group, string target)
        where TModule : class, IModule
    {
        var endpoints = typeof(TModule).Assembly.GetTypes()
            .Where(t =>
                t.IsClass &&
                t.IsAssignableTo(typeof(IEndpoint)) &&
                t.Namespace?.EndsWith(target, StringComparison.Ordinal) == true);

        foreach (var endpoint in endpoints)
        {
            var registerRoutesMethod = endpoint.GetMethod(nameof(IEndpoint.Register));
            registerRoutesMethod?.Invoke(null, [group]);
        }

        return group;
    }
}
