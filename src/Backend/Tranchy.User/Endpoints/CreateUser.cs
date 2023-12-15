using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Entities;
using Tranchy.Common.Constants;
using Tranchy.User.Events;
using Tranchy.User.Mappers;
using Tranchy.User.Requests;

namespace Tranchy.User.Endpoints;

public class CreateUser : IEndpoint
{
    public static async Task<IResult> Create(
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

        logger.CreatedUser(user.ID!, user.UserName!);

        return TypedResults.Ok(user.ID);
    }

    private static async Task<Results<Accepted, BadRequest<string>>> CreateUserAction(
        [FromBody] CreateUserHookRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateUser> logger,
        CancellationToken cancellationToken)
    {
        logger.ReceviedCreatingUserAction(request.UserId, request.Email);

        // Could reuse object id from original source as id of entity User 
        var (providerId, userId) = request.ParseUserId();
        try
        {
            var userEntity = new Data.User
            {
                ID = userId,
                Email = request.Email,
                UserName = request.Email,
                ProviderId = providerId
            };

            await dbContext.BeginTransaction(cancellationToken);
            await DB.InsertAsync(userEntity, dbContext.Session, cancellationToken);
            await publishEndpoint.Publish(new UserCreated { Id = userEntity.ID! }, cancellationToken);
            await dbContext.CommitTransaction(cancellationToken);

            logger.CreatedUser(userEntity.ID, userEntity.UserName);
        }
        catch (MongoWriteException ex) when (ex.WriteError.Category == ServerErrorCategory.DuplicateKey)
        {
            logger.DuplicatedUser(ex);

            return TypedResults.BadRequest("DuplicatedUserIdOrEmail");
        }

        return TypedResults.Accepted(request.UserId);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost(string.Empty, Create).WithName("CreateUser").WithTags("User");

        routeGroupBuilder.MapPost("oauth0/create", CreateUserAction)
            .RequireAuthorization(AuthPolicyNames.CreateUserPolicy)
            .WithName("CreateUserAction")
            .WithTags("User", "OAuth0 Integration");
    }
}
