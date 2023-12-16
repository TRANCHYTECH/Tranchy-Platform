using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.BackOffice;

public class GetUsers : IEndpoint
{
    [ProducesResponseType<GetUserResponse[]>(200)]
    public static async Task<IResult> GetAllUsers([FromServices] ITenant tenant, CancellationToken cancellationToken)
    {
        var users = await DB.Find<Data.User>().ExecuteAsync(cancellationToken);

        return TypedResults.Ok(users.Select(u => u.FromEntity()));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("management/user", GetAllUsers).WithName("GetUsers").WithTags("BackOffice");
    }
}

