using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.Mobile;

public class GetUserExpertise : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet(Constants.CurrentUserSectionEndpointPrefix + "/expertise", GetCurrentUserExpertise)
        .WithName("GetUserExpertise")
        .WithSummary("Get expertise info of current user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<IEnumerable<GetUserExpertiseResponse>>, NotFound>> GetCurrentUserExpertise(
        [FromServices] ITenant tenant,
        CancellationToken cancellationToken)
    {
        var user = await DB.Find<Data.User>().Match(u => u.Email == tenant.Email)
            .ExecuteFirstAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(user.FromUserExpertiseEntity());
    }
}
