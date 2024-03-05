using Tranchy.Question.Commands;
using Tranchy.Question.Data;

namespace Tranchy.Question.Consumers;

public class VerifyNewQuestion(ILogger<VerifyNewQuestion> logger) : IConsumer<VerifyNewQuestionCommand>
{
    public async Task Consume(ConsumeContext<VerifyNewQuestionCommand> context)
    {
        var question = await DB.Find<Data.Question>().MatchID(context.Message.Id).ExecuteFirstAsync();
        if (question is null || question.Status != QuestionStatus.New)
        {
            return;
        }

        question.Approve(string.Empty);
        await question.SaveAsync(cancellation: context.CancellationToken);

        logger.ApprovedQuestion(context.Message.Id, string.Empty);
    }
}
