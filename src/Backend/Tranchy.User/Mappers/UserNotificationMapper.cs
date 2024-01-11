using Mapster;
using Tranchy.User.Data;
using Tranchy.User.Responses;

namespace Tranchy.User.Mappers;

internal static class UserNotificationMapper
{
    static UserNotificationMapper() =>
        TypeAdapterConfig<UserNotification, GetUserNotificationResponse>
            .NewConfig();

    internal static GetUserNotificationResponse FromEntity(this UserNotification data) =>
        data.BuildAdapter().AdaptToType<GetUserNotificationResponse>();
}
