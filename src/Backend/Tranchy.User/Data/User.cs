using MongoDB.Entities;
using Tranchy.Common.Data;

namespace Tranchy.User.Data;

[Collection("User")]
public class User : EntityBase
{
    // todo: check if it's better to move this function to script deployment.

    /// <summary>
    /// This function creates the unique index for field Email.
    /// </summary>
    static User() =>
        DB.Index<User>()
            .Key(x => x.Email, KeyType.Text)
            .Option(o =>
            {
                o.Name = "Email";
                o.Background = false;
                o.Unique = true;
            })
            .CreateAsync(default).GetAwaiter().GetResult();

    public string? ProviderId { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
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
