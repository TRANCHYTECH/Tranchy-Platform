using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints;

public class GetUser : IEndpoint
{
    [ProducesResponseType<GetUserResponse>(200)]
    public static async Task<IResult> GetCurrentUser([FromServices] ITenant tenant, CancellationToken cancellationToken)
    {
        var user = await DB.Find<Data.User>().Match(u => u.UserName == tenant.UserId).ExecuteFirstAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(user.FromEntity());
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet(string.Empty, GetCurrentUser).WithName("GetCurrentUser");
    }
}

