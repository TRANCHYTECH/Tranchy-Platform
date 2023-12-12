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

public record CreateUserExpertiseRequest(
    ExpertiseType ExpertiseType,
    string Title,
    string? MetaData
);

public class CreateUserExpertise : IEndpoint
{
    public static async Task<IResult> Create(
        [FromBody] CreateUserExpertiseRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ITenant tenant,
        [FromServices] ILogger<CreateUserExpertiseRequest> logger,
        CancellationToken cancellationToken
    )
    {
        var user = await UserQueries.GetMyProfileAsync(tenant, cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        var newUserExpertise = request.ToEntity();
        user.Expertises.Add(newUserExpertise);

        await dbContext.BeginTransaction(cancellationToken);
        await DB.SaveAsync(user, dbContext.Session, cancellationToken);
        await publishEndpoint.Publish(new UserExpertiseCreated { UserId = user.ID!, Id = newUserExpertise.ID }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.CreatedUserExpertise(newUserExpertise.ID!, user.ID!);

        return TypedResults.Ok<string>(new(user.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("expertise", Create).WithName("CreateUserExpertise").WithTags("User");
    }
}
