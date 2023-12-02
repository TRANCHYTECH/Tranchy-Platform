using Tranchy.User.Data;

namespace Tranchy.User.Responses;

public class GetUserNotificationResponse
{
    public NotificationType NotificationType { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public bool IsRead { get; set; }
}
