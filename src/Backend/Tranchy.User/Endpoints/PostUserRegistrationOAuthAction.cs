using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Tranchy.Common.Constants;
using Tranchy.User.Requests;
using MassTransit.MongoDbIntegration;

namespace Tranchy.User.Endpoints;

public class PostUserRegistrationOAuthAction : IEndpoint
{
    private static async Task<Accepted> CreateUserHook(
        [FromServices]ILogger<PostUserRegistrationOAuthAction> logger,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateUser> logger1,
        [FromBody]CreateUserHookRequest request)
    {
        logger.CreateUserHook(request);


        var rs = await CreateUser.Create(new CreateUserRequest(request.UserId, request.Email), dbContext, publishEndpoint,
            logger1, cancellationToken: default);
        return TypedResults.Accepted(request.UserId);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapPost("oauth0/create", CreateUserHook)
        .RequireAuthorization(AuthPolicyNames.OAuth0Action)
        .WithName("TestOAuth0Action")
        .WithTags("OAuth0 Integration");
}
