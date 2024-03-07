namespace Tranchy.User.Data;

public class UserSavedQuestionAction : UserActionBase
{
    public UserSavedQuestionAction(string user, string questionId)
    {
        ID = GetID(user);
        Questions = new List<string>();
        Questions.Add(questionId);
    }

    public ICollection<string> Questions { get; init; }

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

    public static string GetID(string user) => $"{user}_{nameof(UserSavedQuestionAction)}";
}
