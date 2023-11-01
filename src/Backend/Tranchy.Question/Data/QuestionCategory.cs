using MongoDB.Entities;

namespace Tranchy.Question.Data;


[Collection("QuestionCategory")]
public class QuestionCategory : Entity, ICreatedOn, IModifiedOn
{
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;

    public DateTime CreatedOn { get; set; } = default!;
    public DateTime ModifiedOn { get; set; } = default!;
}
