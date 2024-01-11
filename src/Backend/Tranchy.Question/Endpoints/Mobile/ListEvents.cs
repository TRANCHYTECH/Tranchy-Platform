using Tranchy.Common.Constants;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.Mobile;

public class ListEvents : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/{questionId}/events", ListQuestionEvents)
        .WithName("ListMobileQuestionEvents")
        .WithSummary("List question events for mobile devices")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<MobileQuestionEvent[]>> ListQuestionEvents(
        string questionId,
        CancellationToken cancellation)
    {
        var events = await DB.Find<QuestionEvent>()
            .Match(e => e.QuestionId == questionId)
            .Sort(e => e.CreatedOn, Order.Ascending)
            .ExecuteAsync(cancellation);

        var response = events.Select(e => e.ToMobileModel()).ToArray();

        return TypedResults.Ok(response);
    }
}
