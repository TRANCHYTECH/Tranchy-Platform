using Tranchy.Question.Data;

namespace Tranchy.Question.Contracts;

public class GetQuestionConfigurationsResponse
{
    public required IEnumerable<QuestionCategory> QuestionCategories { get; init; }
    public required IEnumerable<QuestionPriority> QuestionPriorities { get; init; }
    public required string UserId { get; set; }
    public string Email { get; set; }

}
