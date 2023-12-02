using MongoDB.Entities;
namespace Tranchy.Question.Endpoints;

public class ListEvents : IEndpoint
{
    public static async Task<Ok<MobileQuestionEvent[]>> ListQuestionEvents(string id, CancellationToken cancellation)
    {
        var events = await DB.Find<Data.QuestionEvent>()
        .Match(e => e.QuestionId == id)
        .Sort(e => e.CreatedOn, Order.Ascending)
        .ExecuteAsync(cancellation);

        var response = events.Select(e => e.ToMobileModel()).ToArray();

        return TypedResults.Ok(response);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/mobile/{id}/events", ListQuestionEvents)
        .WithName("ListMobileQuestionEvents")
        .WithSummary("List question events for mobile devices")
        .WithTags("Question Action")
        .WithOpenApi();
}
