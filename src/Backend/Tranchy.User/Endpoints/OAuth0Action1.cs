using Tranchy.Common.Constants;

namespace Tranchy.User.Endpoints;

public record Action(string UserName);

public class OAuth0Action1 : IEndpoint
{
    private static Ok<string> CreateUserHook(HttpContext context, Action input)
    {
        return TypedResults.Ok<string>("response" + input.UserName);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapPost("oauth0/action1", CreateUserHook)
            .WithName("TestOAuth0Action").WithTags("OAuth0 Integration");
}
