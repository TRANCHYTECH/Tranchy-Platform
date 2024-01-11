using Tranchy.Common.Constants;

namespace Tranchy.Question.Endpoints.BackOffice;

public class AcceptQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{questionId}:accept", Accept)
        .WithName("AcceptQuestion")
        .WithSummary("Accept question")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Results<NoContent, BadRequest>> Accept(
        [FromRoute] string questionId,
        CancellationToken cancellationToken)
    {
        var question = await DB.Find<Data.Question>()
            .MatchID(questionId)
            .ExecuteSingleAsync(cancellationToken);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.Approve();
        await DB.SaveAsync(question, cancellation: cancellationToken);

        return TypedResults.NoContent();
    }
}
