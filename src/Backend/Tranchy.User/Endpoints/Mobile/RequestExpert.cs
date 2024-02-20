using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using Tranchy.Common.Events.User;
using Tranchy.Common.Services;

namespace Tranchy.User.Endpoints.Mobile;

public class RequestExpert : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost($"{Constants.CurrentUserEndpoint}:request-expert", Handler)
        .WithName("ExpertRequest")
        .WithSummary("User requests to become expert")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok, NotFound, StatusCodeHttpResult>> Handler(
        [FromServices] ITenant tenant,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<RequestExpert> logger,
        CancellationToken cancellationToken)
    {
        var users = await DB.Find<Data.User>().ExecuteAsync(cancellationToken);

        var user = await DB.Find<Data.User>().Match(u => tenant.UserId.Contains(u.ID))
            .ExecuteSingleAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        if (user.RegistrationStatus != UserRegistrationStatus.CommunityUser)
        {
            return TypedResults.StatusCode(StatusCodes.Status304NotModified);
        }

        user.RegistrationStatus = UserRegistrationStatus.ExpertRequested;

        await dbContext.BeginTransaction(cancellationToken);
        await DB.SaveAsync(user, dbContext.Session, cancellationToken);
        await publishEndpoint.Publish(new UserUpdatedEvent { Id = user.ID! }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.UpdatedUser(user.ID!, user.UserName!);

        return TypedResults.Ok();
    }
}
