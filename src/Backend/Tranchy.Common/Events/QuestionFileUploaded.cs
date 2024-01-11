namespace Tranchy.Common.Events;

public record QuestionFileUploaded
{
    public string QuestionId { get; init; } = default!;
    public string FilePath { get; init; } = default!;
}
