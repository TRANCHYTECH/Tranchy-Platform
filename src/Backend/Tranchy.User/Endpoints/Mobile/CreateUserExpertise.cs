using MassTransit;
using MassTransit.MongoDbIntegration;
using Microsoft.Extensions.Logging;
using Tranchy.Common.Services;
using Tranchy.User.Events;
using Tranchy.User.Mappers;
using Tranchy.User.Queries;
using Tranchy.User.Requests;

namespace Tranchy.User.Endpoints.Mobile;

public class CreateUserExpertise : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost(Constants.CurrentUserSectionEndpointPrefix + "/expertise", Create)
        .WithName("CreateUserExpertise")
        .WithSummary("Create expertise info for current user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<IResult> Create(
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
        await publishEndpoint.Publish(new UserExpertiseCreated { UserId = user.ID!, Id = newUserExpertise.ID },
            cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        logger.CreatedUserExpertise(newUserExpertise.ID!, user.ID!);

        return TypedResults.Ok(new string(user.ID!));
    }
}
