using Tranchy.Common.Services;

namespace Tranchy.Question.Mappers;

internal static class QuestionEventMapper
{
    internal static Data.QuestionEvent ToEntity(
        this CreateQuestionEventRequest request,
        string questionId,
        string userId
    ) =>
        request
            .BuildAdapter()
            .AddParameters(nameof(ITenant.UserId), userId)
            .AddParameters("questionId", questionId)
            .AdaptToType<Data.QuestionEvent>();

    internal static MobileQuestionEvent ToMobileModel(this Data.QuestionEvent @event) => @event.BuildAdapter().AdaptToType<MobileQuestionEvent>();

    static QuestionEventMapper()
    {
        TypeAdapterConfig<CreateQuestionEventRequest, Data.QuestionEvent>
        .NewConfig()
        .Include<CreateQuestionEventMessageSentInput, Data.QuestionEventMessageSent>()
        .Include<CreateQuestionEventStatusChangedInput, Data.QuestionEventStatusChanged>()
        .Include<CreateQuestionEventFileAttachedInput, Data.QuestionEventFileAttached>()
        .Include<CreateQuestionEventVoiceCalledInput, Data.QuestionEventVoiceCalled>()
        .Include<CreateQuestionEventVideoCalledInput, Data.QuestionEventVoiceCalled>()
        .Map(dest => dest.QuestionId, _ => MapContext.Current!.Parameters["questionId"])
        .Map(dest => dest.CreatedByUserId, _ => MapContext.Current!.Parameters[nameof(ITenant.UserId)]);

        TypeAdapterConfig<Data.QuestionEvent, MobileQuestionEvent>
        .NewConfig()
        .Map(s => s.User.Id, t => t.CreatedByUserId)
        .Include<Data.QuestionEventMessageSent, MobileQuestionEventMessageSent>();
    }
}
