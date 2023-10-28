using MassTransit;
using Microsoft.Extensions.Logging;
using Tranchy.Question.Commands;

namespace Tranchy.Question.Consumers;

public class VerifyQuestionConsumer : IConsumer<VerifyQuestion>
{
    private readonly ILogger<VerifyQuestionConsumer> _logger;

    public VerifyQuestionConsumer(ILogger<VerifyQuestionConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<VerifyQuestion> context)
    {
        _logger.LogInformation("Verified question {question}", context.Message.Id);

        return Task.CompletedTask;
    }
}

