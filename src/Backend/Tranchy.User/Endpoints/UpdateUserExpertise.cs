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

public record UpdateUserExpertiseRequest(
    string Id,
    ExpertiseType ExpertiseType,
    string Title,
    string? MetaData
);

public class UpdateUserExpertise : IEndpoint
{
    public static async Task<IResult> Update(
        [FromBody] UpdateUserExpertiseRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ITenant tenant,
        [FromServices] ILogger<UpdateUserExpertise> logger,
        CancellationToken cancellationToken
    )
    {
        var user = await UserQueries.GetMyProfileAsync(tenant, cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        int expertiseIndex = ((List<UserExpertise>)user.Expertises).FindIndex(e => string.Equals(e.ID, request.Id, StringComparison.OrdinalIgnoreCase));

        if (expertiseIndex == -1)
        {
            return TypedResults.NotFound();
        }

        var existingExpertise = user.Expertises[expertiseIndex];

        user.Expertises[expertiseIndex] = request.ToEntity(existingExpertise);
        await dbContext.BeginTransaction(cancellationToken);
        await DB.InsertAsync(user, dbContext.Session, cancellationToken);
        await publishEndpoint.Publish(new UserCreated { Id = user.ID! }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.UpdatedUserExpertise(user.Expertises[expertiseIndex].ID!, user.UserName!);

        return TypedResults.Ok<string>(new(user.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder
            .MapPut("expertise", Update)
            .WithName("UpdateUserExpertise")
            .WithTags("User");
    }
}