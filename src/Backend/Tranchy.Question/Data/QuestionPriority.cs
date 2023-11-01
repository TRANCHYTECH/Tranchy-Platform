using MongoDB.Entities;

namespace Tranchy.Question.Data;

[Collection("QuestionPriority")]
public class QuestionPriority : Entity, ICreatedOn, IModifiedOn
{
    public LocalizedJson Title { get; set; } = default!;
    public LocalizedJson Description { get; set; } = default!;
    public int Rank { get; set; }
    public IDictionary<string, object> PriorityMetaData { get; set; } = default!;
    public TimeSpan Duration { get; set; } = default!;

    public DateTime CreatedOn { get; set; } = default!;
    public DateTime ModifiedOn { get; set; } = default!;
}
