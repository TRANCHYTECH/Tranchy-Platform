using Tranchy.Common.Services;
using Tranchy.User.Data;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.Mobile;

public class GetSavedQuestions: IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/me/sections/saved-questions", Handler)
        .WithName("GetSavedQuestions")
        .WithSummary("Get user saved questions")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<GetSavedQuestionsResponse>> Handler(
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        string actionId = UserSavedQuestionAction.GetID(tenant.UserId);
        var action = await DB.Find<UserSavedQuestionAction>()
            .MatchID(actionId)
            .ExecuteSingleAsync(cancellation);

        return TypedResults.Ok(new GetSavedQuestionsResponse(action?.Questions ?? new List<string>()));
    }
}
