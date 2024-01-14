namespace Tranchy.Common.Events;

public record UserCreatedEvent
{
    public required string UserId { get; set; }
}
