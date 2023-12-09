using MongoDB.Entities;
using Tranchy.Common.Data;

namespace Tranchy.User.Data;

[Collection("User")]
public class User : EntityBase
{
    public string? ProviderId { get; set; }
    public string? UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Headline { get; set; }
    public string? ProfilePictureBlobLocation { get; set; }
    public Gender Gender { get; set; }
    public string[]? CategoryIds { get; set; }
    public UserRole[] Roles { get; set; } = Array.Empty<UserRole>();
    public IList<UserExpertise> Expertises { get; set; } = new List<UserExpertise>();
    public IList<UserContact> Contacts { get; set; } = new List<UserContact>();
}

public class UserExpertise : EntityBase
{
    public ExpertiseType ExpertiseType { get; set; }
    public required string Title { get; set; }
    public string? MetaData { get; set; }
}

public class UserContact : EntityBase
{
    public ContactType ContactType { get; set; }
    public required string Value { get; set; }
}
