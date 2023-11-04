using Tranchy.Question.Data;

namespace Tranchy.Question.Contracts;

public record CreateQuestionInput(
    string Title,
    SupportLevel SupportLevel,
    string? PriorityId,
    string[] QuestionCategoryIds,
    bool? CommunityShareAgreement
);
