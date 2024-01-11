using Tranchy.Question.Commands;

namespace Tranchy.Question.Consumers;

public class VerifyQuestionConsumer : IConsumer<VerifyQuestion>
{
    private readonly ILogger<VerifyQuestionConsumer> _logger;

    public VerifyQuestionConsumer(ILogger<VerifyQuestionConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<VerifyQuestion> context)
    {
        var question = await DB.Find<Data.Question>().MatchID(context.Message.Id).ExecuteFirstAsync();
        if (question is null || question.Status != Data.QuestionStatus.New)
        {
            return;
        }

        question.Approve();
        await question.SaveAsync(cancellation: context.CancellationToken);

        _logger.ApprovedQuestion(context.Message.Id, string.Empty);
    }
}

