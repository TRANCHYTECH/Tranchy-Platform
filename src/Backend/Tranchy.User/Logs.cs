using Microsoft.Extensions.Logging;
using Tranchy.User.Endpoints;
using Tranchy.User.Requests;

namespace Tranchy.User;

public static partial class Logs
{
    [LoggerMessage(
        EventId = 0,
        Level = LogLevel.Information,
        Message = "Created user with id=`{id}` username `{username}`")]
    public static partial void CreatedUser(this ILogger logger, string id, string username);

    [LoggerMessage(
        EventId = 1,
        Level = LogLevel.Information,
        Message = "Creating user hook invoked")]
    public static partial void CreateUserHook(this ILogger logger, CreateUserHookRequest request);
}
