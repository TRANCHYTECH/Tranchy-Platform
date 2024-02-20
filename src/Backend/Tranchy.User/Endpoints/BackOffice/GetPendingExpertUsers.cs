using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.BackOffice;

public class GetPendingExpertUsers : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/aggregates/pending-experts", GetAllPendingExperts)
        .WithName("GetAllPendingExperts")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Ok<IEnumerable<GetUserResponse>>> GetAllPendingExperts(
        CancellationToken cancellationToken)
    {
        var users = await DB.Find<Data.User>().Match(u => u.RegistrationStatus == UserRegistrationStatus.ExpertRequested)
        .Sort(u => u.ModifiedOn, Order.Ascending)
        .ExecuteAsync(cancellationToken);

        return TypedResults.Ok(users.Select(u => u.FromEntity()));
    }
}
