namespace Tranchy.User.Data;

public class UserSavedQuestionAction : UserActionBase
{
    public UserSavedQuestionAction(string userId, string questionId)
    {
        ID =  GetID(userId);
        Questions = new List<string>();
        Questions.Add(questionId);
    }

    public bool AppendQuestion(string questionId)
    {
        if (Questions.Contains(questionId, StringComparer.Ordinal))
        {
            return false;
        }

        Questions.Add(questionId);

        return true;
    }

    public bool RemoveQuestion(string questionId)
    {
        if (!Questions.Contains(questionId, StringComparer.Ordinal))
        {
            return false;
        }

        Questions.Remove(questionId);
        return true;
    }

    public ICollection<string> Questions { get; init; }

    public static string GetID(string userId) => $"{userId}_{nameof(UserSavedQuestionAction)}";
}
