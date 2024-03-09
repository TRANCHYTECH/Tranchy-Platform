using Tranchy.User.Data;

namespace Tranchy.User.Responses;

public class GetUserResponse
{
    public required string ID { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Headline { get; set; }
    public string? ProfilePictureBlobLocation { get; set; }
    public string[]? CategoryIds { get; set; }
}

public class GetUserExpertiseResponse
{
    public required string ID { get; set; }
    public ExpertiseType ExpertiseType { get; set; }
    public required string Title { get; set; }
    public string? MetaData { get; set; }
}

public class GetUserContactResponse
{
    public required string ID { get; set; }
    public ContactType ContactType { get; set; }
    public required string Value { get; set; }
}
