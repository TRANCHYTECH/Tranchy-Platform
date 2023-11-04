using Tranchy.Question.Data;

namespace Tranchy.Question.Requests;

public record CreateQuestionRequest(
    string Title,
    SupportLevel SupportLevel,
    string? PriorityId,
    string[] QuestionCategoryIds,
    bool? CommunityShareAgreement
);
