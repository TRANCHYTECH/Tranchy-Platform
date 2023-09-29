namespace Tranchy.Common
{
    public class AppSettings
    {
        public AuthenticationSettings Authentication { get; set; } = default!;

        public string AgencyPortalSpaUrl { get; set; } = default!;

        public DatabaseOptions QuestionDb { get; set; } = default!;

        public string ServiceBusConnectionString { get; set; } = default!;
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

    public class DatabaseOptions
    {
        public string DatabaseName { get; set; } = default!;

        public string ConnectionString { get; set; } = default!;
    }
}
