using Tranchy.Common.Data;
using Tranchy.Common.Exceptions;

namespace Tranchy.Question.Data;

[Collection("Question")]
public class Question : EntityBase, IOwnEntity, IQueryIndex
{
    // todo: check if it's better to move this function to script deployment.
    // todo: index for status?
    /// <summary>
    ///     This function creates the unique index for field QueryIndex.
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
            .CreateAsync(CancellationToken.None).GetAwaiter().GetResult();

    public required string Title { get; set; }
    public required SupportLevel SupportLevel { get; set; }
    public QuestionStatus Status { get; private set; } = QuestionStatus.New;
    public string? PriorityId { get; set; }
    public int PriorityRank { get; set; }
    public string[] CategoryIds { get; set; } = Array.Empty<string>();
    public bool? CommunityShareAgreement { get; set; }
    public QuestionConsultant? Consultant { get; private set; }

    [Ignore] public QuestionPermissions? Permissions { get; private set; }

    public string Comment { get; set; } = string.Empty;
    public required string CreatedBy { get; init; }

    public long QueryIndex { get; init; }

    public void Approve(string? comment)
    {
        Status = QuestionStatus.Accepted;
        if (!string.IsNullOrEmpty(comment))
        {
            Comment = comment;
        }
    }

    public void Reject(string comment)
    {
        Status = QuestionStatus.Rejected;
        if (!string.IsNullOrEmpty(comment))
        {
            Comment = comment;
        }
    }

    public void TakeConsultation(string user)
    {
        if (string.Equals(CreatedBy, user, StringComparison.Ordinal))
        {
            throw new TranchyAteChillyException("Could not pick yourself");
        }

        if (Status != QuestionStatus.Accepted)
        {
            throw new TranchyAteChillyException("Invalid status");
        }

        Status = QuestionStatus.InProgress;
        Consultant = new QuestionConsultant { User = user, CreatedOn = DateTime.UtcNow };
    }

    public void FinishConsultation(string userId, string conclusion)
    {
        if (Status != QuestionStatus.InProgress)
        {
            throw new TranchyAteChillyException("Invalid status");
        }

        if (Consultant is null || !string.Equals(Consultant.User, userId, StringComparison.Ordinal))
        {
            throw new TranchyAteChillyException("Invalid consultant");
        }

        Consultant.Conclusion = conclusion;
        Status = QuestionStatus.Resolved;
    }

    public void RefinePermissions(string user)
    {
        Permissions = new QuestionPermissions();

        switch (Status)
        {
            // Actions.
            case QuestionStatus.Accepted:
                if (!IsRequester(user))
                {
                    Permissions.Actions.Add(QuestionAction.TakeConsultation);
                }

                break;
            case QuestionStatus.InProgress when IsConsultant(user):
                Permissions.DirectChatTargetUser = CreatedBy;
                Permissions.Actions.Add(QuestionAction.GoToConversation);
                break;
            case QuestionStatus.InProgress:
                if (IsRequester(user))
                {
                    Permissions.DirectChatTargetUser = Consultant?.User;
                    Permissions.Actions.Add(QuestionAction.GoToConversation);
                }

                break;

            case QuestionStatus.New:
                break;
            case QuestionStatus.BeingReviewed:
                break;
            case QuestionStatus.Cancelled:
                break;
            case QuestionStatus.Payment:
                break;
            case QuestionStatus.Rejected:
                break;
            case QuestionStatus.Resolved:
                break;
            case QuestionStatus.Closed:
                break;
            case QuestionStatus.Reported:
                break;
        }
    }

    private bool IsRequester(string user) => string.Equals(CreatedBy, user, StringComparison.Ordinal);
    private bool IsConsultant(string user) => string.Equals(Consultant?.User, user, StringComparison.Ordinal);
}
