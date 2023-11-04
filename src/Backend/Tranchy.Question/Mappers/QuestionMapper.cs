using Tranchy.Common.Services;

namespace Tranchy.Question.Mappers;

internal static class QuestionMapper
{
    internal static Data.Question ToEntity(this CreateQuestionRequest request, string userId) => request.BuildAdapter()
    .AddParameters(nameof(ITenant.UserId), userId).AdaptToType<Data.Question>();

    static QuestionMapper()
    {
        TypeAdapterConfig<CreateQuestionRequest, Data.Question>
        .NewConfig()
        .Map(dest => dest.Status, _ => Data.QuestionStatus.New)
        .Map(dest => dest.CreatedByUserId, _ => MapContext.Current!.Parameters[nameof(ITenant.UserId)]);
    }
}
