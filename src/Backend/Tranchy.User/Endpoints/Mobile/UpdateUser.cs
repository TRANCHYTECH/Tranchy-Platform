using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using Tranchy.Common.Events.User;
using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Queries;
using Tranchy.User.Requests;

namespace Tranchy.User.Endpoints.Mobile;

public class UpdateUser : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPut(Constants.CurrentUserEndpoint, Update)
        .WithName("UpdateUser")
        .WithSummary("Update current user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<IResult> Update(
        [FromBody] UpdateUserRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<UpdateUser> logger,
        [FromServices] ITenant tenant,
        CancellationToken cancellationToken
    )
    {
        var user = await UserQueries.GetMyProfileAsync(tenant, cancellationToken);

        if (user is null)
        {
            return TypedResults.BadRequest();
        }

        var updatedUser = request.ToEntity(user);
        await dbContext.BeginTransaction(cancellationToken);
        await DB.SaveAsync(updatedUser, dbContext.Session, cancellationToken);
        await publishEndpoint.Publish(new UserUpdatedEvent { Id = user.ID! }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.UpdatedUser(user.ID!, user.UserName!);

        return TypedResults.Ok(new string(user.ID!));
    }
}
