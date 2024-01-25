using Tranchy.Question.Events;

namespace Tranchy.Question.Consumers;

public class NotifyAgencyNewQuestion(ILogger<NotifyAgencyNewQuestion> logger) : IConsumer<QuestionCreatedEvent>
{
    public Task Consume(ConsumeContext<QuestionCreatedEvent> context)
    {
        logger.CreatedQuestion("User created question '{id}'", context.Message.Id);

        return Task.CompletedTask;
    }
}
