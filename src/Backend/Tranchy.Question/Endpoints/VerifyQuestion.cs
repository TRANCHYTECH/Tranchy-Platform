using MongoDB.Entities;

namespace Tranchy.Question.Endpoints;

public class VerifyQuestion : IEndpoint
{
    public static async Task<Results<NoContent, BadRequest>> Accept([FromRoute] string id, CancellationToken cancellationToken = default)
    {
        var question = await DB.Find<Data.Question>().MatchID(id).ExecuteSingleAsync(cancellationToken);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.Approve();
        await DB.SaveAsync(question, cancellation: cancellationToken);

        return TypedResults.NoContent();
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{id}/accept", Accept)
        .WithName("AcceptQuestion")
        .WithSummary("Accept question")
        .WithTags("Question Action")
        .WithOpenApi();
}

