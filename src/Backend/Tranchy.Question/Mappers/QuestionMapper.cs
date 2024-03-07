using Tranchy.Question.Data;

namespace Tranchy.Question.Mappers;

internal static class QuestionMapper
{
    static QuestionMapper() =>
        TypeAdapterConfig<CreateQuestionRequest, Data.Question>
            .NewConfig()
            .Map(dest => dest.Status, _ => QuestionStatus.New)
            .Map(dest => dest.CreatedBy,
                _ => MapContext.Current!.Parameters[nameof(Data.Question.CreatedBy)])
            .Map(dest => dest.QueryIndex, _ => MapContext.Current!.Parameters[nameof(Data.Question.QueryIndex)]);

    internal static Data.Question ToEntity(this CreateQuestionRequest request, string user, long queryIndex) =>
        request.BuildAdapter()
            .AddParameters(nameof(Data.Question.CreatedBy), user)
            .AddParameters(nameof(Data.Question.QueryIndex), queryIndex)
            .AdaptToType<Data.Question>();
}
