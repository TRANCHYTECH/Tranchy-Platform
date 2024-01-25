using MassTransit;
using Microsoft.Extensions.Logging;
using Tranchy.Common.Events.User;

namespace Tranchy.Notification.Consumers;

public class NotifyQuestionCreatedViaEmail(ILogger<NotifyQuestionCreatedViaEmail> logger) : IConsumer<UserCreatedEvent>
{
    public Task Consume(ConsumeContext<UserCreatedEvent> context)
    {
        logger.NotifiedQuestionCreatedViaEmail();

        return Task.CompletedTask;
    }
}
