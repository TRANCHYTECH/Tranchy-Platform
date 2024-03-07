namespace Tranchy.Question.Data;

public class QuestionConsultant
{
    public required string User { get; init; }
    public required DateTime CreatedOn { get; set; }
    public string? Conclusion { get; set; }
    public ICollection<string> AttachmentIds { get; set; } = new List<string>();
}
