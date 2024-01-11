using Tranchy.Question.Commands;

namespace Tranchy.Question.Consumers;

public class VerifyQuestionConsumer(ILogger<VerifyQuestionConsumer> logger) : IConsumer<VerifyQuestion>
{
    public async Task Consume(ConsumeContext<VerifyQuestion> context)
    {
        var question = await DB.Find<Data.Question>().MatchID(context.Message.Id).ExecuteFirstAsync();
        if (question is null || question.Status != Data.QuestionStatus.New)
        {
            return;
        }

        question.Approve();
        await question.SaveAsync(cancellation: context.CancellationToken);

        logger.ApprovedQuestion(context.Message.Id, string.Empty);
    }
}
