using MassTransit;
using Microsoft.Extensions.Logging;
using Tranchy.Question.Events;

namespace Tranchy.Question.Consumers;

public class NotifyAgencyConsumer : IConsumer<QuestionCreated>
{
    private readonly ILogger<NotifyAgencyConsumer> _logger;

    public NotifyAgencyConsumer(ILogger<NotifyAgencyConsumer> logger)
    {
        _logger = logger;
    }

    public Task Consume(ConsumeContext<QuestionCreated> context)
    {
        _logger.LogInformation("User created question '{id}'", context.Message.Id);

        return Task.CompletedTask;
    }
}

