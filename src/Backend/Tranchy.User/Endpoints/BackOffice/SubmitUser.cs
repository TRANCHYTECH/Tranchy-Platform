using MassTransit;
using MassTransit.MongoDbIntegration;
using Tranchy.Common.Events.User;

namespace Tranchy.User.Endpoints.BackOffice;

public class SubmitUser : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/submit-user", Handler)
        .WithName("SubmitUser")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Ok> Handler(
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromQuery] string userId,
        CancellationToken cancellation)
    {
        await dbContext.BeginTransaction(cancellation);
        await publishEndpoint.Publish(new UserCreatedEvent { UserId = userId }, cancellation);
        await dbContext.CommitTransaction(cancellation);

        return TypedResults.Ok();
    }
}
