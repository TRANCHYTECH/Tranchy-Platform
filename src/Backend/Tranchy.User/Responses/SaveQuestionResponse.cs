namespace Tranchy.User.Responses;

public class SaveQuestionResponse
{
    public required ICollection<string> Questions { get; set; }
}
