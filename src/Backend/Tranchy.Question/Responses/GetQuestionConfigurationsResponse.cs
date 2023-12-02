using Tranchy.Question.Data;

namespace Tranchy.Question.Responses;

public class GetQuestionConfigurationsResponse
{
    public required IEnumerable<QuestionCategory> QuestionCategories { get; init; }
    public required IEnumerable<QuestionPriority> QuestionPriorities { get; init; }
    public required string UserId { get; set; }
    public required string Email { get; set; }
}
