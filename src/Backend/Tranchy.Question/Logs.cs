namespace Tranchy.Question;

public static partial class Logs
{
    [LoggerMessage(
        EventId = 0,
        Level = LogLevel.Information,
        Message = "Created question with id=`{id}` title `{title}`")]
    public static partial void CreatedQuestion(this ILogger logger, string id, string title);

    [LoggerMessage(
    EventId = 1,
    Level = LogLevel.Information,
    Message = "Handle question file uploaded {question}")]
    public static partial void HandledQuestion(this ILogger logger, string question);
}
