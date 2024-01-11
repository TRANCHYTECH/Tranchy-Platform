using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.BackOffice;

public class GetUsers : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/", GetAllUsers)
        .WithName("GetUsers")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Ok<IEnumerable<GetUserResponse>>> GetAllUsers(
        CancellationToken cancellationToken)
    {
        var users = await DB.Find<Data.User>().ExecuteAsync(cancellationToken);

        return TypedResults.Ok(users.Select(u => u.FromEntity()));
    }
}
