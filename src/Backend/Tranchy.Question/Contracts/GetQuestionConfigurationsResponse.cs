using Tranchy.Question.Data;

namespace Tranchy.Question.Contracts;

public class GetQuestionConfigurationsResponse
{
    public required QuestionCategory[] QuestionCategories { get; init; }
}
