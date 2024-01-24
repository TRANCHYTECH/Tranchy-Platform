namespace Tranchy.Question.Events;

public record QuestionEventCreatedEvent
{
    public required string Id { get; set; }
}
