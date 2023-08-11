namespace Tranchy.Ask.API
{
    public class AppSettings
    {
        public AuthenticationSettings Authentication { get; set; } = default!;

        public string AgencyPortalSpaUrl { get; set; } = default!;
    }

    public class AuthenticationSettings
    {
        public Schemes Schemes { get; set; } = default!;
    }

    public class Schemes
    {
        public OpenIdConnectSetting OpenIdConnect { get; set; } = default!;
    }

    public class OpenIdConnectSetting
    {
        public string Authority { get; set; } = default!;

        public string ClientId { get; set; } = default!;

        public string ClientSecret { get; set; } = default!;

        public string ValidAudience { get; set; } = default!;

        public string[] Scopes { get; set; } = default!;
    }
}
