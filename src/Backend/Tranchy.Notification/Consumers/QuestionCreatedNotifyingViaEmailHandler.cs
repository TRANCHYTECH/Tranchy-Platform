using MassTransit;
using Tranchy.Common.Events;

namespace Tranchy.Notification.Consumers;

public class QuestionCreatedNotifyingViaEmailHandler : IConsumer<UserCreatedEvent>
{
    public Task Consume(ConsumeContext<UserCreatedEvent> context) => throw new NotImplementedException();
}
