using Tranchy.Common.Services;

namespace Tranchy.User.Endpoints;

public record QuestionOutput(string Id);

public class CreateUser : IEndpoint
{
    public static async Task<IResult> Create([FromServices] ITenant tenant, CancellationToken cancellationToken)
    {
        return TypedResults.Ok();
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost(string.Empty, Create).WithName("CreateUser");
    }
}
