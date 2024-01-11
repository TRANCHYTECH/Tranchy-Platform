using Tranchy.Common.Events;

namespace Tranchy.Question.Consumers;

public class QuestionFileUploadedConsumer(ILogger<QuestionFileUploadedConsumer> logger)
    : IConsumer<QuestionFileUploaded>
{
    public Task Consume(ConsumeContext<QuestionFileUploaded> context)
    {
        logger.HandledQuestion(context.Message.FilePath);

        return Task.CompletedTask;
    }
}
