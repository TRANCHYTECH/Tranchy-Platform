namespace Tranchy.Question.Mappers;

internal static class QuestionMapper
{
    internal static Data.Question ToEntity(this CreateQuestionRequest request, string userId, long queryIndex) => request.BuildAdapter()
        .AddParameters(nameof(Data.Question.CreatedByUserId), userId)
        .AddParameters(nameof(Data.Question.QueryIndex), queryIndex)
        .AdaptToType<Data.Question>();

    internal static QuestionBrief ToQuestionBrief(Data.Question q) => new()
    {
        ID = q.ID,
        Title = q.Title,
        Categories = q.QuestionCategoryIds,
        CreatedOn = q.CreatedOn,
        Price = "vnd 500",
        CreatedBy = q.CreatedByUserId
    };

    static QuestionMapper()
    {
        TypeAdapterConfig<CreateQuestionRequest, Data.Question>
        .NewConfig()
        .Map(dest => dest.Status, _ => Data.QuestionStatus.New)
        .Map(dest => dest.CreatedByUserId, _ => MapContext.Current!.Parameters[nameof(Data.Question.CreatedByUserId)])
        .Map(dest => dest.QueryIndex, _ => MapContext.Current!.Parameters[nameof(Data.Question.QueryIndex)]);
    }
}
