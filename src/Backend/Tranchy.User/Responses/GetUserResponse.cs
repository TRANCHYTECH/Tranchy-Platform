namespace Tranchy.User.Responses;

public class GetUserResponse
{
    public string? UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Headline { get; set; }
    public string? ProfilePictureBlobLocation { get; set; }
}
