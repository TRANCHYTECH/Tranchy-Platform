using Tranchy.Common.Events.File;

namespace Tranchy.Question.Consumers;

public class LogQuestionFileUploaded(ILogger<LogQuestionFileUploaded> logger)
    : IConsumer<QuestionFileUploadedEvent>
{
    public Task Consume(ConsumeContext<QuestionFileUploadedEvent> context)
    {
        logger.HandledQuestion(context.Message.FilePath);

        return Task.CompletedTask;
    }
}
