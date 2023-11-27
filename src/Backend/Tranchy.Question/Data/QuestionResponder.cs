namespace Tranchy.Question.Data;

public class QuestionConsultant
{
    public required string UserId { get; set; }
    public required DateTime CreatedAt { get; set; }
    public string? Conclusion { get; set; }
    public ICollection<string> AttachmentIds { get; set; } = new List<string>();
}
