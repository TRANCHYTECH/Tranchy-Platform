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
        EventId = 0,
        Level = LogLevel.Information,
        Message = "Updated user with id=`{id}` username `{username}`")]
    public static partial void UpdatedUser(this ILogger logger, string id, string username);

    [LoggerMessage(
    EventId = 0,
    Level = LogLevel.Information,
    Message = "Created user expertise with id=`{id}` for user {userId}")]
    public static partial void CreatedUserExpertise(this ILogger logger, string id, string userId);

    [LoggerMessage(
    EventId = 0,
    Level = LogLevel.Information,
    Message = "Updated user expertise with id=`{id}` for user {userId}")]
    public static partial void UpdatedUserExpertise(this ILogger logger, string id, string userId);

    [LoggerMessage(
        EventId = 1,
        Level = LogLevel.Information,
        Message = "Creating user hook invoked")]
    public static partial void CreateUserHook(this ILogger logger, CreateUserHookRequest request);
}
