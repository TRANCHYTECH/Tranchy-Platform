using Microsoft.Extensions.Logging;
using Tranchy.Common.Constants;
using Tranchy.User.Requests;

namespace Tranchy.User.Endpoints;

public class PostUserRegistrationOAuthAction : IEndpoint
{
    private static Accepted CreateUserHook(
        [FromServices]ILogger<PostUserRegistrationOAuthAction> logger,
        [FromBody]CreateUserHookRequest request)
    {
        logger.CreateUserHook(request);

        return TypedResults.Accepted(request.UserId);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapPost("oauth0/create", CreateUserHook)
        .RequireAuthorization(AuthPolicyNames.OAuth0Action)
        .WithName("TestOAuth0Action")
        .WithTags("OAuth0 Integration");
}
