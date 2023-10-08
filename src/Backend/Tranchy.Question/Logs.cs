using Microsoft.Extensions.Logging;

namespace Tranchy.Question;
public static partial class Logs
{
    [LoggerMessage(
        EventId = 0,
        Level = LogLevel.Information,
        Message = "Created question with title `{title}`")]
    public static partial void CreatedQuestion(this ILogger logger, string title);
}
