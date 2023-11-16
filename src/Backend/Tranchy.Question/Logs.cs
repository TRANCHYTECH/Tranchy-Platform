namespace Tranchy.Question;

public static partial class Logs
{
    [LoggerMessage(
        EventId = 0,
        Level = LogLevel.Information,
        Message = "Created question with id=`{id}` title `{title}`")]
    public static partial void CreatedQuestion(this ILogger logger, string id, string title);

    [LoggerMessage(
        EventId = 2,
        Level = LogLevel.Information,
        Message = "Approved question with id=`{id}` title `{title}`")]
    public static partial void ApprovedQuestion(this ILogger logger, string id, string title);

    [LoggerMessage(
    EventId = 3,
    Level = LogLevel.Information,
    Message = "Handle question file uploaded {question}")]
    public static partial void HandledQuestion(this ILogger logger, string question);

    [LoggerMessage(
    EventId = 22,
    Level = LogLevel.Information,
    Message = "Created question event with id=`{questionEventId}` for question `{questionId}` by user {userId}")]
    public static partial void CreatedQuestionEvent(this ILogger logger, string questionEventId, string questionId, string userId);
}
