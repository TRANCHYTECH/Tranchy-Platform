namespace Tranchy.Common.Events.User;

public record UserExpertiseCreatedEvent
{
    public required string Id { get; set; }
    public required string UserId { get; set; }
}
