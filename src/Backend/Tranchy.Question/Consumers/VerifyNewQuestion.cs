using Tranchy.Question.Commands;

namespace Tranchy.Question.Consumers;

public class VerifyNewQuestion(ILogger<VerifyNewQuestion> logger) : IConsumer<VerifyNewQuestionCommand>
{
    public async Task Consume(ConsumeContext<VerifyNewQuestionCommand> context)
    {
        var question = await DB.Find<Data.Question>().MatchID(context.Message.Id).ExecuteFirstAsync();
        if (question is null || question.Status != Data.QuestionStatus.New)
        {
            return;
        }

        question.Approve(comment: string.Empty);
        await question.SaveAsync(cancellation: context.CancellationToken);

        logger.ApprovedQuestion(context.Message.Id, string.Empty);
    }
}
