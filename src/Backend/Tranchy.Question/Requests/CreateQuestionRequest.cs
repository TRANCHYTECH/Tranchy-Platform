using Tranchy.Question.Data;

namespace Tranchy.Question.Requests;

public record CreateQuestionRequest(
    string Title,
    SupportLevel SupportLevel,
    string? PriorityId,
    int PriorityRank,
    string[] QuestionCategoryIds,
    bool? CommunityShareAgreement
);
