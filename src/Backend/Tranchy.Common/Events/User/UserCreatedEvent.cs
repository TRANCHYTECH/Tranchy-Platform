namespace Tranchy.Common.Events.User;

public record UserCreatedEvent
{
    public required string UserId { get; set; }
}
