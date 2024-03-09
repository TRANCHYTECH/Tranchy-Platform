using Tranchy.Common.Services;

namespace Tranchy.User.Endpoints.BackOffice;

public class SupportDevUpdateUser : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/development-supports:add-categories-to-me", Seed)
        .WithName("AddCategoriesToMe")
        .WithTags(Tags.DevelopmentSupport)
        .WithOpenApi();

    private static async Task<Results<Ok, NotFound>> Seed(
        [FromServices] ITenant tenant,
        [FromBody] AddCategoriesToUserRequest request,
        CancellationToken cancellationToken)
    {
        var user = await DB.Find<Data.User>().Match(u => u.Email == tenant.Email)
            .ExecuteSingleAsync(cancellationToken);

        if (user is null)
        {
            return TypedResults.NotFound();
        }

        user.CategoryIds = request.CategoryIds;
        await user.SaveAsync(cancellation: cancellationToken);

        return TypedResults.Ok();
    }

    public record AddCategoriesToUserRequest(string[] CategoryIds);
}
