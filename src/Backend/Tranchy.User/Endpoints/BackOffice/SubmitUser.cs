using MassTransit;
using Tranchy.Common.Events;

namespace Tranchy.User.Endpoints.BackOffice;

public class SubmitUser : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/submit-user", Handler)
        .WithName("SubmitUser")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Ok> Handler(
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromQuery] string userId,
        CancellationToken cancellation)
    {
        await publishEndpoint.Publish(new UserCreatedEvent { UserId = userId }, cancellation);

        return TypedResults.Ok();
    }
}
