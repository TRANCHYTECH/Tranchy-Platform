using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Entities;
using Tranchy.Common.Data;
using Tranchy.Common.Exceptions;

namespace Tranchy.Question.Data;

[Collection("Question")]
public class Question : EntityBase, IOwnEntity
{
    public required string Title { get; set; }
    public required SupportLevel SupportLevel { get; set; }
    public QuestionStatus Status { get; private set; } = QuestionStatus.New;
    public required string CreatedByUserId { get; init; }
    public string? PriorityId { get; set; }
    public string[] QuestionCategoryIds { get; set; } = Array.Empty<string>();
    public bool? CommunityShareAgreement { get; set; }
    public QuestionResponder? Responder { get; set; }

    [Ignore]
    public QuestionPermissions? Permissions { get; private set; }

    public void Approve() => Status = QuestionStatus.Accepted;
    public void Pick(string userId)
    {
        if (string.Equals(CreatedByUserId, userId, StringComparison.Ordinal))
        {
            throw new TranchyAteChillyException("Could not pick yourself");
        }

        if (Status != QuestionStatus.Accepted)
        {
            throw new TranchyAteChillyException("Invalid status");
        }

        Responder = new() { UserId = userId, CreatedAt = DateTime.UtcNow };
        Status = QuestionStatus.InProgress;
    }

    public void SetPermissions(string userId)
    {
        Permissions = new QuestionPermissions();
        if (string.Equals(CreatedByUserId, userId, StringComparison.Ordinal))
        {
            Permissions.Role = "Requester";
        }
        else if (string.Equals(Responder?.UserId, userId, StringComparison.Ordinal))
        {
            Permissions.Role = "Responder";
        }
    }
}
