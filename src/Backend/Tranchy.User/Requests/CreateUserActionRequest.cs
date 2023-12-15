using Tranchy.Common.Exceptions;

namespace Tranchy.User.Requests;

public record CreateUserActionRequest
{
    public required string UserId { get; set; }

    public required string Email { get; set; }

    public (string ProviderId, string UserId) ParseUserId()
    {
        string[] parts = UserId.Split('|');

        if (parts.Length != 2 || !string.Equals(parts[0], "auth0", StringComparison.Ordinal))
        {
            throw new TranchyAteChillyException($"UserId is invalid: {UserId}");
        }

        return (parts[0], parts[1]);
    }
}
