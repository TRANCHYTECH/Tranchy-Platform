using MongoDB.Entities;
using Tranchy.Common.Data;

namespace Tranchy.Question.Data;

[Collection("QuestionCategory")]
public class QuestionCategory : EntityBase
{
    public required string Key { get; set; }
    public required LocalizedString Title { get; set; }
    public required LocalizedString Description { get; set; }
}
