using MassTransit.MongoDbIntegration;
using Tranchy.Common.Constants;
using Tranchy.Question.Events;

namespace Tranchy.Question.Endpoints.BackOffice;

public class RejectQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{questionId}:reject", Accept)
        .WithName("RejectQuestion")
        .WithSummary("Reject question")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Results<NoContent, BadRequest>> Accept(
        [FromRoute] string questionId,
        [FromBody] RejectQuestionRequest request,
        [FromServices] MongoDbContext dbContext,
        [FromServices] IPublishEndpoint publishEndpoint,
        CancellationToken cancellationToken)
    {
        var question = await DB.Find<Data.Question>()
            .MatchID(questionId)
            .ExecuteSingleAsync(cancellationToken);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        var oldStatus = question.Status;
        question.Reject(request.Comment);
        await dbContext.BeginTransaction(cancellationToken);
        await DB.SaveAsync(question, cancellation: cancellationToken);
        await publishEndpoint.Publish(new QuestionStatusChanged { Id = question.ID!, NewStatus = question.Status, OldStatus = oldStatus }, cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        return TypedResults.NoContent();
    }
}
