using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.User.Data;
using Tranchy.User.Events;
using Tranchy.User.Mappers;
using Tranchy.User.Queries;

namespace Tranchy.User.Endpoints;

public record UpdateUserRequest(string FirstName, string LastName, string Headline, Gender Gender);

public class UpdateUser : IEndpoint
{
    public static async Task<IResult> Update(
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
        await publishEndpoint.Publish(new UserUpdated { Id = user.ID! }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.UpdatedUser(user.ID!, user.UserName!);

        return TypedResults.Ok<string>(new(user.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPut(string.Empty, Update).WithName("UpdateUser").WithTags("User");
    }
}
