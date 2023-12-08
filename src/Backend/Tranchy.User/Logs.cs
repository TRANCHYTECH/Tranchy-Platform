using Microsoft.Extensions.Logging;

namespace Tranchy.User;

public static partial class Logs
{
    [LoggerMessage(
        EventId = 0,
        Level = LogLevel.Information,
        Message = "Created user with id=`{id}` username `{username}`")]
    public static partial void CreatedUser(this ILogger logger, string id, string username);
}
