using Tranchy.Common.Services;
using Tranchy.User.Data;

namespace Tranchy.User.Endpoints.Mobile;

public class UnsavedQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapDelete("/me/sections/saved-questions/{questionId}", Handler)
        .WithName("UnsavedQuestion")
        .WithSummary("Unsaved question from their list")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok> Handler(
        [FromServices] ITenant tenant,
        [FromRoute] string questionId,
        CancellationToken cancellation)
    {
        string actionId = UserSavedQuestionAction.GetID(tenant.UserId);

        var action = await DB.Find<UserSavedQuestionAction>()
            .MatchID(actionId)
            .ExecuteSingleAsync(cancellation);
        if (action is null)
        {
            return TypedResults.Ok();
        }

        bool removeResult = action.RemoveQuestion(questionId);
        if (removeResult)
        {
            await DB.SaveAsync(action, cancellation: cancellation);
        }

        return TypedResults.Ok();
    }
}
