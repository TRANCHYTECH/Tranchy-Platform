namespace Tranchy.Common.Services;

public interface ITenant
{
    string UserId { get; }

    string Email { get; }
}