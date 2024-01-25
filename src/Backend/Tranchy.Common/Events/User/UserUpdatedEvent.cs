namespace Tranchy.Common.Events.User;

public record UserUpdatedEvent
{
    public required string Id { get; set; }
}
