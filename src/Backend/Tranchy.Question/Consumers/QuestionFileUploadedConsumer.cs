using Tranchy.Common.Events;

namespace Tranchy.Question.Consumers;

public class QuestionFileUploadedConsumer : IConsumer<QuestionFileUploaded>
{
    private readonly ILogger<QuestionFileUploadedConsumer> _logger;

    public QuestionFileUploadedConsumer(ILogger<QuestionFileUploadedConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<QuestionFileUploaded> context)
    {
        _logger.LogInformation("Handle question file uploaded {question}", context.Message.FilePath);

        return Task.CompletedTask;
    }
}

