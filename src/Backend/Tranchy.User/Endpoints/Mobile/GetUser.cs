using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.Mobile;

public class GetUser : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet(Constants.CurrentUserEndpoint, GetCurrentUser)
        .WithName("GetCurrentUser")
        .WithSummary("Get current user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<GetUserResponse>, NotFound>> GetCurrentUser(
        [FromServices] ITenant tenant,
        CancellationToken cancellationToken)
    {
        var user = await DB.Find<Data.User>().Match(u => u.Email == tenant.Email)
            .ExecuteSingleAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(user.FromEntity());
    }
}
