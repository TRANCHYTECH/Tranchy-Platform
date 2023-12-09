using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using MongoDB.Entities;
using Tranchy.User.Events;
using Tranchy.User.Mappers;

namespace Tranchy.User.Endpoints;

public record CreateUserRequest(string UserName, string Email);

public class CreateUser : IEndpoint
{
    public static async Task<IResult> Create(
        [FromBody] CreateUserRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateUser> logger,
        CancellationToken cancellationToken
    )
    {
        var user = request.ToEntity();
        await dbContext.BeginTransaction(cancellationToken);
        await DB.InsertAsync(user, dbContext.Session, cancellationToken);
        await publishEndpoint.Publish(new UserCreated { Id = user.ID! }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.CreatedUser(user.ID!, user.UserName!);

        return TypedResults.Ok<string>(new(user.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost(string.Empty, Create).WithName("CreateUser").WithTags("User");
    }
}
