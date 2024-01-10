using MongoDB.Entities;
using Tranchy.Common.Data;
using Tranchy.Common.Exceptions;

namespace Tranchy.Question.Data;

[Collection("Question")]
public class Question : EntityBase, IOwnEntity
{
    // todo: check if it's better to move this function to script deployment.
    /// <summary>
    /// This function creates the unique index for field QueryIndex.
    /// </summary>
    static Question() =>
        DB.Index<Question>()
            .Key(x => x.QueryIndex, KeyType.Ascending)
            .Option(o =>
            {
                o.Name = "QueryIndex";
                o.Background = false;
                o.Unique = true;
            })
            .CreateAsync(default).GetAwaiter().GetResult();
    public required string Title { get; set; }
    public required SupportLevel SupportLevel { get; set; }
    public QuestionStatus Status { get; private set; } = QuestionStatus.New;
    public required string CreatedByUserId { get; init; }
    public string? PriorityId { get; set; }
    public string[] QuestionCategoryIds { get; set; } = Array.Empty<string>();
    public bool? CommunityShareAgreement { get; set; }
    public QuestionConsultant? Consultant { get; private set; }

    [Ignore]
    public QuestionPermissions? Permissions { get; private set; }

    public long QueryIndex { get; set; }

    public void Approve() => Status = QuestionStatus.Accepted;

    public void TakeConsultation(string userId)
    {
        if (string.Equals(CreatedByUserId, userId, StringComparison.Ordinal))
        {
            throw new TranchyAteChillyException("Could not pick yourself");
        }

        if (Status != QuestionStatus.Accepted)
        {
            throw new TranchyAteChillyException("Invalid status");
        }

        Status = QuestionStatus.InProgress;
        Consultant = new() { UserId = userId, CreatedAt = DateTime.UtcNow };
    }

    public void FinishConsultation(string userId, string conclusion)
    {
        if (Status != QuestionStatus.InProgress)
        {
            throw new TranchyAteChillyException("Invalid status");
        }

        if (Consultant is null || !string.Equals(Consultant.UserId, userId, StringComparison.Ordinal))
        {
            throw new TranchyAteChillyException("Invalid consultant");
        }

        Consultant.Conclusion = conclusion;
        Status = QuestionStatus.Resolved;
    }

    public void RefinePermissions(string userId)
    {
        Permissions = new QuestionPermissions();

        // Actions.
        if (Status == QuestionStatus.Accepted)
        {
            if (!IsRequester(userId))
            {
                Permissions.Actions.Add(QuestionAction.TakeConsultation);
            }
        }
        else if (Status == QuestionStatus.InProgress)
        {
            if (IsConsultant(userId))
            {
                Permissions.DirectChatTargetUserId = CreatedByUserId;
                Permissions.Actions.Add(QuestionAction.GoToConversation);
            }
            else if (IsRequester(userId))
            {
                Permissions.DirectChatTargetUserId = Consultant?.UserId;
                Permissions.Actions.Add(QuestionAction.GoToConversation);
            }
        }
    }

    private bool IsRequester(string userId) => string.Equals(CreatedByUserId, userId, StringComparison.Ordinal);
    private bool IsConsultant(string userId) => string.Equals(Consultant?.UserId, userId, StringComparison.Ordinal);
}
