using Tranchy.Question.Contracts;

namespace Tranchy.Question.Mappers;

internal static class QuestionMapper
{
    internal static Data.Question ToDbQuestion(this CreateQuestionInput questionInput, string userId)
    => new()
    {
        Status = Data.QuestionStatus.New,
        SupportLevel = questionInput.SupportLevel,
        Title = questionInput.Title,
        PriorityId = questionInput.PriorityId,
        QuestionCategoryIds = questionInput.QuestionCategoryIds,
        CommunityShareAgreement = questionInput.CommunityShareAgreement,
        CreatedByUserId = userId
    };
}
