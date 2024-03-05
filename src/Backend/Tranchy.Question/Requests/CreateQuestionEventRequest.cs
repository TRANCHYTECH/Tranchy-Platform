using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;
using Tranchy.Question.Data;

namespace Tranchy.Question.Requests;

[SwaggerDiscriminator("$type")]
[JsonDerivedType(typeof(CreateQuestionEventMessageSentRequest), nameof(QuestionEventType.MessageSent))]
[SwaggerSubType(typeof(CreateQuestionEventMessageSentRequest),
    DiscriminatorValue = nameof(QuestionEventType.MessageSent))]
[JsonDerivedType(typeof(CreateQuestionEventStatusChangedRequest), nameof(QuestionEventType.StatusChanged))]
[SwaggerSubType(typeof(CreateQuestionEventStatusChangedRequest),
    DiscriminatorValue = nameof(QuestionEventType.StatusChanged))]
[JsonDerivedType(typeof(CreateQuestionEventFileAttachedRequest), nameof(QuestionEventType.FileAttached))]
[SwaggerSubType(typeof(CreateQuestionEventFileAttachedRequest),
    DiscriminatorValue = nameof(QuestionEventType.FileAttached))]
[JsonDerivedType(typeof(CreateQuestionEventVoiceCalledRequest), nameof(QuestionEventType.VoiceCalled))]
[SwaggerSubType(typeof(CreateQuestionEventVoiceCalledRequest),
    DiscriminatorValue = nameof(QuestionEventType.VoiceCalled))]
[JsonDerivedType(typeof(CreateQuestionEventVideoCalledRequest), nameof(QuestionEventType.VideoCalled))]
[SwaggerSubType(typeof(CreateQuestionEventVideoCalledRequest),
    DiscriminatorValue = nameof(QuestionEventType.VideoCalled))]
[JsonDerivedType(typeof(CreateQuestionEventReactedRequest), nameof(QuestionEventType.EventReacted))]
[SwaggerSubType(typeof(CreateQuestionEventReactedRequest), DiscriminatorValue = nameof(QuestionEventType.EventReacted))]
public class CreateQuestionEventRequest
{
    public required CreateEventMetadata Metadata { get; set; }
}

public class CreateQuestionEventMessageSentRequest : CreateQuestionEventRequest
{
    public required string Content { get; set; }
}

public class CreateQuestionEventStatusChangedRequest : CreateQuestionEventRequest
{
    public required string PreviousStatusChangedEventId { get; set; }
    public QuestionStatus QuestionStatus { get; set; }
    public object? StatusMetaData { get; set; }
}

public class CreateQuestionEventFileAttachedRequest : CreateQuestionEventRequest
{
    public required string FileName { get; set; }
    public required string FileType { get; set; }
    public required string BlobLocation { get; set; }
}

public class CreateQuestionEventVoiceCalledRequest : CreateQuestionEventRequest
{
    public required string Content { get; set; }
}

public class CreateQuestionEventVideoCalledRequest : CreateQuestionEventRequest
{
    public DateTime StartedAt { get; set; }
    public DateTime EndedAt { get; set; }
    public required string BlobLocation { get; set; }
}

// TBD
public class CreateQuestionEventReactedRequest : CreateQuestionEventRequest
{
}

public record CreateEventMetadata(string? QuestionId, string? NotifiedUserId);
