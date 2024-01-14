using Tranchy.Question.Data;

namespace Tranchy.Question.Events;

public record QuestionStatusChanged
{
    public required string Id { get; set; }
    public required QuestionStatus OldStatus { get; set; }
    public required QuestionStatus NewStatus { get; set; }
}
