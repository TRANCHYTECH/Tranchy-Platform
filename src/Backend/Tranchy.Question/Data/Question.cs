using MongoDB.Entities;

namespace Tranchy.Question.Data
{
    [Collection("Question")]
    public class Question : Entity, ICreatedOn, IModifiedOn
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public SupportLevel SupportLevel { get; set; }
        public QuestionStatus Status { get; set; }
        public required string CreatedByUserId { get; set; }
        public string[] QuestionCategoryIds { get; set; } = Array.Empty<string>();
        public DateTime CreatedOn { get; set; } = default!;
        public DateTime ModifiedOn { get; set; } = default!;
    }
}
