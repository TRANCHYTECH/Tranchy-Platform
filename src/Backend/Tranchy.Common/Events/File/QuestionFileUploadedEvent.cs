namespace Tranchy.Common.Events.File;

public record QuestionFileUploadedEvent
{
    public string QuestionId { get; init; } = default!;
    public string FilePath { get; init; } = default!;
}
