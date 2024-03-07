using MongoDB.Bson.Serialization.Attributes;
using Tranchy.Common.Data;

namespace Tranchy.Question.Data;

[Collection("QuestionEvent")]
[BsonKnownTypes(
    typeof(QuestionEventMessageSent),
    typeof(QuestionEventStatusChanged),
    typeof(QuestionEventFileAttached),
    typeof(QuestionEventVoiceCalled),
    typeof(QuestionEventVideoCalled)
)]
public abstract class QuestionEvent : EntityBase, IOwnEntity
{
    public required string QuestionId { get; set; }
    public required string CreatedBy { get; init; }
}

public class QuestionEventMessageSent : QuestionEvent
{
    public required string Content { get; set; }
}

public class QuestionEventStatusChanged : QuestionEvent
{
    public required string PreviousStatusChangedEventId { get; set; }
    public QuestionStatus QuestionStatus { get; set; }
    public object? StatusMetaData { get; set; }
}

public class QuestionEventFileAttached : QuestionEvent
{
    public required string FileName { get; set; }
    public required string FileType { get; set; }
    public required string BlobLocation { get; set; }
}

public class QuestionEventVoiceCalled : QuestionEvent
{
    public required string Content { get; set; }
}

public class QuestionEventVideoCalled : QuestionEvent
{
    public DateTime StartedAt { get; set; }
    public DateTime EndedAt { get; set; }
    public required string BlobLocation { get; set; }
}

// TBD
//public class QuestionEventReacted : QuestionEvent
//{
//    public required string Content { get; set; }
//}
