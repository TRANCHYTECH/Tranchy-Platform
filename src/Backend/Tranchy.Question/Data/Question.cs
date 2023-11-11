using MongoDB.Entities;
using Tranchy.Common.Data;

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
    public DateTime CreatedOn { get; set; } = default!;
    public DateTime ModifiedOn { get; set; } = default!;

    public void Approve() => Status = QuestionStatus.Accepted;
}
