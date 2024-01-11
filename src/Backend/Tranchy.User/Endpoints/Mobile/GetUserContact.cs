using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.Mobile;

public class GetUserContact : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet(Constants.CurrentUserSectionEndpointPrefix + "/contact", GetCurrentUserContacts)
        .WithName("GetCurrentUserContacts")
        .WithSummary("Get current user contact")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<IEnumerable<GetUserExpertiseResponse>>, NotFound>> GetCurrentUserContacts(
        [FromServices] ITenant tenant,
        CancellationToken cancellationToken)
    {
        var user = await DB.Find<Data.User>().Match(u => u.UserName == tenant.UserId)
            .ExecuteFirstAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(user.FromUserExpertiseEntity());
    }
}
