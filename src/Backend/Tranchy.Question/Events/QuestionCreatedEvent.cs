namespace Tranchy.Question.Events;

public record QuestionCreatedEvent
{
    public required string Id { get; set; }
}
