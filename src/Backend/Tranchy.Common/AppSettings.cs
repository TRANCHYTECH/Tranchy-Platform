namespace Tranchy.Common;

public class AppSettings
{
    public AuthenticationSettings Authentication { get; init; } = default!;

    public string AgencyPortalSpaUrl { get; init; } = default!;

    public DatabaseOptions QuestionDb { get; init; } = default!;
    public DatabaseOptions UserDb { get; init; } = default!;

    public string ServiceBusConnectionString { get; init; } = default!;

    public AzureMonitorSettings AzureMonitor { get; init; } = default!;

    public FileSettings File { get; init; } = default!;
}

public class AzureMonitorSettings
{
    public string ConnectionString { get; set; } = default!;
}

public class AuthenticationSettings
{
    public Schemes Schemes { get; set; } = default!;
}

public class Schemes
{
    public OpenIdConnectSetting OpenIdConnect { get; set; } = default!;

    public OpenIdConnectSetting Swagger { get; set; } = default!;
}

public class OpenIdConnectSetting
{
    public string Authority { get; set; } = default!;

    public string ClientId { get; set; } = default!;

    public string ClientSecret { get; set; } = default!;

    public string[] ValidAudiences { get; set; } = default!;

    public string[] Scopes { get; set; } = default!;

    public string? AuthorizationUrl { get; set; }

    public string? TokenUrl { get; set; }
}

public class DatabaseOptions
{
    public string DatabaseName { get; set; } = default!;

    public string ConnectionString { get; set; } = default!;
}

public class FileSettings
{
    public string UnsafeQuestionFileContainerUri { get; set; } = default!;
    public string BlobStorageConnectionString { get; set; } = default!;
}
