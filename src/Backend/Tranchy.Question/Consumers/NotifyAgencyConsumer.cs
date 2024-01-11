using Tranchy.Question.Events;

namespace Tranchy.Question.Consumers;

public class NotifyAgencyConsumer(ILogger<NotifyAgencyConsumer> logger) : IConsumer<QuestionCreated>
{
    public Task Consume(ConsumeContext<QuestionCreated> context)
    {
        logger.CreatedQuestion("User created question '{id}'", context.Message.Id);

        return Task.CompletedTask;
    }
}
