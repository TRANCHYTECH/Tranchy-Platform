using Tranchy.Common.Constants;
using Tranchy.Question.Data;

namespace Tranchy.Question.Requests;

public class QueryQuestionsRequest : PaginationParameters
{
    public bool? Other { get; init; }
    public bool? Mine { get; init; }
    public bool? MyConsultation { get; init; }
    public SupportLevel? SupportLevel { get; init; }
    public QuestionStatus? Status { get; init; }
    public QuestionStatus[]? Statuses { get; init; }
    public IEnumerable<string>? Categories { get; init; }
    public SortingType CreatedAtSortingType { get; init; } = SortingType.Ascending;
    public bool ApplyPagination { get; init; }
    public SortingType? PrioritySorting { get; init; }
    public IEnumerable<string>? ExceptIds { get; init; }
    public bool ProjectQuestionBrief { get; set; }
}
