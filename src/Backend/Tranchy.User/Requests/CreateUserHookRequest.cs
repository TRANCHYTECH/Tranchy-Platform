namespace Tranchy.User.Requests;

public record CreateUserHookRequest
{
    public required string UserId { get; set; }

    public required string Email { get; set; }

    public required DateTime CreatedAt { get; set; }
}
