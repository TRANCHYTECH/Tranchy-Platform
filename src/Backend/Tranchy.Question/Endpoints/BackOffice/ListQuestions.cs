using Tranchy.Common.Constants;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints.BackOffice;

public class ListQuestions : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/", ListAllQuestions)
        .WithName("ListAllQuestions")
        .WithSummary("List all questions")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Ok<Data.Question[]>> ListAllQuestions(CancellationToken cancellation)
    {
        var questions = await DB.Find<Data.Question>()
            .Sort(q => q.CreatedOn, Order.Descending)
            .ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.ToArray());
    }
}
