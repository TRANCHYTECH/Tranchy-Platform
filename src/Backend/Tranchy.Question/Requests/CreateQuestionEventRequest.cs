using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;
using Tranchy.Question.Data;
namespace Tranchy.Question.Requests;

[SwaggerDiscriminator("$type")]

[JsonDerivedType(typeof(CreateQuestionEventMessageSentInput), nameof(QuestionEventType.MessageSent))]
[SwaggerSubType(typeof(CreateQuestionEventMessageSentInput), DiscriminatorValue = nameof(QuestionEventType.MessageSent))]

[JsonDerivedType(typeof(CreateQuestionEventStatusChangedInput), nameof(QuestionEventType.StatusChanged))]
[SwaggerSubType(typeof(CreateQuestionEventStatusChangedInput), DiscriminatorValue = nameof(QuestionEventType.StatusChanged))]

[JsonDerivedType(typeof(CreateQuestionEventFileAttachedInput), nameof(QuestionEventType.FileAttached))]
[SwaggerSubType(typeof(CreateQuestionEventFileAttachedInput), DiscriminatorValue = nameof(QuestionEventType.FileAttached))]

[JsonDerivedType(typeof(CreateQuestionEventVoiceCalledInput), nameof(QuestionEventType.VoiceCalled))]
[SwaggerSubType(typeof(CreateQuestionEventVoiceCalledInput), DiscriminatorValue = nameof(QuestionEventType.VoiceCalled))]

[JsonDerivedType(typeof(CreateQuestionEventVideoCalledInput), nameof(QuestionEventType.VideoCalled))]
[SwaggerSubType(typeof(CreateQuestionEventVideoCalledInput), DiscriminatorValue = nameof(QuestionEventType.VideoCalled))]

[JsonDerivedType(typeof(QuestionEventReacted), nameof(QuestionEventType.EventReacted))]
[SwaggerSubType(typeof(QuestionEventReacted), DiscriminatorValue = nameof(QuestionEventType.EventReacted))]
public class CreateQuestionEventRequest
{
    public required CreateEventMetadata Metadata { get; set; }
}

public class CreateQuestionEventMessageSentInput : CreateQuestionEventRequest
{
    public required string Content { get; set; }
}


public class CreateQuestionEventStatusChangedInput : CreateQuestionEventRequest
{
    public required string PreviousStatusChangedEventId { get; set; }
    public QuestionStatus QuestionStatus { get; set; }
    public object? StatusMetaData { get; set; }
}

public class CreateQuestionEventFileAttachedInput : CreateQuestionEventRequest
{
    public required string FileName { get; set; }
    public required string FileType { get; set; }
    public required string BlobLocation { get; set; }
}

public class CreateQuestionEventVoiceCalledInput : CreateQuestionEventRequest
{
    public required string Content { get; set; }
}

public class CreateQuestionEventVideoCalledInput : CreateQuestionEventRequest
{
    public DateTime StartedAt { get; set; }
    public DateTime EndedAt { get; set; }
    public required string BlobLocation { get; set; }
}

// TBD
public class QuestionEventReacted : CreateQuestionEventRequest
{
}

public record CreateEventMetadata(string? QuestionId, string? NotifiedUserId);
