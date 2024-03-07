using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Mappers;

internal static class QuestionEventMapper
{
    static QuestionEventMapper()
    {
        TypeAdapterConfig<CreateQuestionEventRequest, QuestionEvent>
            .NewConfig()
            .Include<CreateQuestionEventMessageSentRequest, QuestionEventMessageSent>()
            .Include<CreateQuestionEventStatusChangedRequest, QuestionEventStatusChanged>()
            .Include<CreateQuestionEventFileAttachedRequest, QuestionEventFileAttached>()
            .Include<CreateQuestionEventVoiceCalledRequest, QuestionEventVoiceCalled>()
            .Include<CreateQuestionEventVideoCalledRequest, QuestionEventVideoCalled>()
            .Map(dest => dest.QuestionId, _ => MapContext.Current!.Parameters["questionId"])
            .Map(dest => dest.CreatedBy, _ => MapContext.Current!.Parameters[nameof(ITenant.Email)]);

        TypeAdapterConfig<QuestionEvent, MobileQuestionEvent>
            .NewConfig()
            .Map(s => s.User.Id, t => t.CreatedBy)
            .Include<QuestionEventMessageSent, MobileQuestionEventMessageSent>();
    }

    internal static QuestionEvent ToEntity(
        this CreateQuestionEventRequest request,
        string questionId,
        string user
    ) =>
        request
            .BuildAdapter()
            .AddParameters(nameof(ITenant.Email), user)
            .AddParameters("questionId", questionId)
            .AdaptToType<QuestionEvent>();

    internal static MobileQuestionEvent ToMobileModel(this QuestionEvent @event) =>
        @event.BuildAdapter().AdaptToType<MobileQuestionEvent>();
}
