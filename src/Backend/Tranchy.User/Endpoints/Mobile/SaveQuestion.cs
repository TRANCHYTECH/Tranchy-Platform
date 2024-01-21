using Tranchy.Common.Services;
using Tranchy.User.Data;
using Tranchy.User.Requests;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.Mobile;

public class SaveQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/me/sections/saved-questions", Handler)
        .WithName("UserSaveQuestion")
        .WithSummary("User saves question to their list")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<SaveQuestionResponse>> Handler(
        [FromServices] ITenant tenant,
        [FromBody] SaveQuestionRequest request,
        CancellationToken cancellation)
    {
        var requestedAction = new UserSavedQuestionAction(tenant.UserId, request.QuestionId);

        var action = await DB.Find<UserSavedQuestionAction>()
            .MatchID(requestedAction.ID)
            .ExecuteSingleAsync(cancellation);
        if (action is null)
        {
            action = requestedAction;
            await DB.InsertAsync(action, cancellation: cancellation);
        }
        else
        {
            bool appendResult = action.AppendQuestion(request.QuestionId);
            if (appendResult)
            {
                await DB.SaveAsync(action, cancellation: cancellation);
            }
        }

        return TypedResults.Ok(new SaveQuestionResponse { Questions = action.Questions });
    }
}
