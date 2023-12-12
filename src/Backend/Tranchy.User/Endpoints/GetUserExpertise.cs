using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints;

public class GetUserExpertise : IEndpoint
{
    [ProducesResponseType<IEnumerable<GetUserExpertiseResponse>>(200)]
    public static async Task<IResult> GetCurrentUserExpertise([FromServices] ITenant tenant, CancellationToken cancellationToken)
    {
        var user = await DB.Find<Data.User>().Match(u => u.UserName == tenant.UserId).ExecuteFirstAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(user.FromUserExpertiseEntity());
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("expertise", GetCurrentUserExpertise).WithName("GetUserExpertise").WithTags("User");
    }
}

