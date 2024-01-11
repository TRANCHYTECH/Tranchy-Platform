using Tranchy.User.Data;

namespace Tranchy.User.Requests;

public record CreateUserExpertiseRequest(
    ExpertiseType ExpertiseType,
    string Title,
    string? MetaData
);
