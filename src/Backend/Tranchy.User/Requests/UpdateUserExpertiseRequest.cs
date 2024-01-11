using Tranchy.User.Data;

namespace Tranchy.User.Requests;

public record UpdateUserExpertiseRequest(
    string Id,
    ExpertiseType ExpertiseType,
    string Title,
    string? MetaData
);
