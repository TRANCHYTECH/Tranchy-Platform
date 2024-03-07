using System.Collections.ObjectModel;

namespace Tranchy.Question.Data;

public class QuestionPermissions
{
    public ICollection<QuestionAction> Actions { get; init; } = new Collection<QuestionAction>();
    public string? DirectChatTargetUser { get; set; }
}

public enum QuestionAction
{
    TakeConsultation,
    GoToConversation
}
