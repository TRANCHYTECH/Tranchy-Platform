using MongoDB.Entities;

namespace Tranchy.Question.Data;


[Collection("QuestionCategory")]
public class QuestionCategory : EntityBase
{
    public LocalizedJson Title { get; set; } = default!;
    public LocalizedJson Description { get; set; } = default!;
}
