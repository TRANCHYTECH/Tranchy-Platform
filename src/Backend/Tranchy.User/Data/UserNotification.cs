using MongoDB.Entities;
using Tranchy.Common.Data;

namespace Tranchy.User.Data;

[Collection("UserNotification")]
public class UserNotification : EntityBase
{
    public required string UserId { get; set; }
    public NotificationType NotificationType { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public bool IsRead { get; set; }
}

public enum NotificationType
{
    MessageReplied,
    QuestionAnswered
}
