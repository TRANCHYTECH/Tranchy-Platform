namespace Tranchy.User.Events;

public record UserCreated
{
    public required string Id { get; set; }
}
