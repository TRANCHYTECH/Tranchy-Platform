using MongoDB.Entities;

namespace Tranchy.Question.Data;

[Collection("QuestionCategory")]
public class QuestionCategory : EntityBase
{
    public required string Key { get; set; }
    public LocalizedString Title { get; set; } = default!;
    public LocalizedString Description { get; set; } = default!;
    public DateTime CreatedOn { get; set; } = default!;
    public DateTime ModifiedOn { get; set; } = default!;
}
