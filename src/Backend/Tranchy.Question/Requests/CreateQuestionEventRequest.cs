using System.Text.Json.Serialization;
using Tranchy.Question.Data;

namespace Tranchy.Question.Requests;

[JsonDerivedType(typeof(CreateQuestionEventMessageSentInput), (int)QuestionEventType.MessageSent)]
[JsonDerivedType(
    typeof(CreateQuestionEventStatusChangedInput),
    (int)QuestionEventType.StatusChanged
)]
[JsonDerivedType(typeof(CreateQuestionEventFileAttachedInput), (int)QuestionEventType.FileAttached)]
[JsonDerivedType(typeof(CreateQuestionEventVoiceCalledInput), (int)QuestionEventType.VoiceCalled)]
[JsonDerivedType(typeof(CreateQuestionEventVideoCalledInput), (int)QuestionEventType.VideoCalled)]
[JsonDerivedType(typeof(QuestionEventReacted), (int)QuestionEventType.EventReacted)]
public class CreateQuestionEventRequest
{
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
