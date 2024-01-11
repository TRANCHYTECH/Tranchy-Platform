using Tranchy.User.Data;

namespace Tranchy.User.Requests;

public record UpdateUserRequest(string FirstName, string LastName, string Headline, Gender Gender);
