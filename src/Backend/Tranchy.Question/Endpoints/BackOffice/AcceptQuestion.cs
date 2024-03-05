using MassTransit.MongoDbIntegration;
using Tranchy.Common.Constants;
using Tranchy.Question.Events;

namespace Tranchy.Question.Endpoints.BackOffice;

public class AcceptQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{questionId}:accept", Accept)
        .WithName("AcceptQuestion")
        .WithSummary("Accept question")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Results<Ok, BadRequest>> Accept(
        [FromRoute] string questionId,
        [FromBody] AcceptQuestionRequest request,
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
        question.Approve(request?.Comment);
        await dbContext.BeginTransaction(cancellationToken);
        await DB.SaveAsync(question, cancellation: cancellationToken);
        await publishEndpoint.Publish(
            new QuestionStatusChangedEvent { Id = question.ID!, NewStatus = question.Status, OldStatus = oldStatus },
            cancellationToken);
        await dbContext.CommitTransaction(cancellationToken);

        return TypedResults.Ok();
    }
}
