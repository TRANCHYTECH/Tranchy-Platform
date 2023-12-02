using Mapster;
using Tranchy.User.Responses;

namespace Tranchy.User.Mappers;

internal static class UserNotificationMapper
{
    internal static GetUserNotificationResponse FromEntity(this Data.UserNotification data) => data.BuildAdapter().AdaptToType<GetUserNotificationResponse>();

    static UserNotificationMapper()
    {
        TypeAdapterConfig<Data.UserNotification, GetUserNotificationResponse>
        .NewConfig();
    }
}
