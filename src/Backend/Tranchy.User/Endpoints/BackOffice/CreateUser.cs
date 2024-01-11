using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using Tranchy.User.Events;
using Tranchy.User.Mappers;
using Tranchy.User.Requests;

namespace Tranchy.User.Endpoints.BackOffice;

public class CreateUser : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost(string.Empty, Create)
        .WithName("CreateUser")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<IResult> Create(
        [FromBody] CreateUserRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateUser> logger,
        CancellationToken cancellationToken)
    {
        var user = request.ToEntity();

        await dbContext.BeginTransaction(cancellationToken);
        await DB.InsertAsync(user, dbContext.Session, cancellationToken);
        await publishEndpoint.Publish(new UserCreated { Id = user.ID! }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.CreatedUser(user.ID, user.UserName);

        return TypedResults.Ok(user.ID);
    }
}
