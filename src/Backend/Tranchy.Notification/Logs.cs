using Microsoft.Extensions.Logging;

namespace Tranchy.Notification;

public static partial class Logs
{
    [LoggerMessage(
        EventId = 0,
        Level = LogLevel.Information,
        Message = "")]
    public static partial void NotifiedQuestionCreatedViaEmail(this ILogger logger);
}
