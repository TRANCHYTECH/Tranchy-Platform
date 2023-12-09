namespace Tranchy.User.Events;

public record UserExpertiseCreated
{
    public required string Id { get; set; }
    public required string UserId { get; set; }
}
