using Tranchy.Common.Constants;

namespace Tranchy.User.Endpoints;

public record Action(string UserName);

public class OAuth0Action1 : IEndpoint
{
    private static Ok<string> CreateUserHook(Action input)
    {
        return TypedResults.Ok("response" + input.UserName);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapPost("oauth0/action1", CreateUserHook)
        .RequireAuthorization(AuthPolicyNames.OAuth0Action)
        .WithName("TestOAuth0Action")
        .WithTags("OAuth0 Integration");
}
