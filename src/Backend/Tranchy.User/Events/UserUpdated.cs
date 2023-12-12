namespace Tranchy.User.Events;

public record UserUpdated
{
    public required string Id { get; set; }
}
