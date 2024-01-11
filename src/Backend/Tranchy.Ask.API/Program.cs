using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Tranchy.Question;
using Tranchy.Ask.API;
using Tranchy.Payment;
using Tranchy.Common;
using Azure.Identity;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Azure.Monitor.OpenTelemetry.AspNetCore;
// using Microsoft.Extensions.Diagnostics.HealthChecks;
using Tranchy.File;
using System.Text.Json.Serialization;
using IdGen.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Tranchy.Common.Constants;
using Tranchy.User;

const string agencyPortalSpaPolicy = "agency-portal-spa";

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false)
.ConfigureAppConfiguration(config =>
{
    config.AddAzureAppConfiguration(options =>
    {
        string? appConfigName = builder.Configuration["AppConfigName"];
        options.Connect(new Uri($"https://{appConfigName}.azconfig.io"), new DefaultAzureCredential())
        .Select(KeyFilter.Any, builder.Environment.EnvironmentName);
        options.ConfigureKeyVault(options => options.SetCredential(new DefaultAzureCredential()));
    });
});
builder.Services.AddAzureClients(config =>
{
    string? vault = builder.Configuration["KeyVaultName"];
    config.UseCredential(new DefaultAzureCredential());
    config.AddSecretClient(new Uri($"https://{vault}.vault.azure.net"));
});
builder.Services.Configure<ForwardedHeadersOptions>(options => options.ForwardedHeaders = ForwardedHeaders.XForwardedHost | ForwardedHeaders.XForwardedProto);

var appSettings = new AppSettings();
builder.Configuration.Bind(appSettings);
builder.Services.Configure<AppSettings>(builder.Configuration);
builder.Services.AddMemoryCache();

builder.Services.RegisterModules(appSettings);

builder.Services.AddTranchySwagger(appSettings);

builder.Services.RegisterHubService();

builder.Services.AddCors(options =>
{
    options.AddPolicy(agencyPortalSpaPolicy,
                      policyBuilder =>
                      {
                          policyBuilder
                            .WithOrigins(appSettings.AgencyPortalSpaUrl)
                            .AllowCredentials()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                      });
});

builder.Services.AddBff(options =>
{
    options.BackchannelLogoutAllUserSessions = true;
    options.EnableSessionCleanup = true;
});

builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = "MultiAuthSchemes";
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
        options.DefaultSignOutScheme = OpenIdConnectDefaults.AuthenticationScheme;
        // options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    }).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        // host prefixed cookie name
        options.Cookie.Name = "__Host.Web.Ask";

        // strict SameSite handling
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    }).AddOpenIdConnect(OpenIdConnectDefaults.AuthenticationScheme, options =>
    {
        options.Authority = appSettings.Authentication.Schemes.OpenIdConnect.Authority;
        // confidential client using code flow + PKCE
        options.ClientId = appSettings.Authentication.Schemes.OpenIdConnect.ClientId;
        options.ClientSecret = appSettings.Authentication.Schemes.OpenIdConnect.ClientSecret;
        options.ResponseType = "code";
        options.ResponseMode = "query";
        options.MapInboundClaims = false;
        options.GetClaimsFromUserInfoEndpoint = true;
        options.SaveTokens = true;
        // request scopes + refresh tokens
        options.Scope.Clear();
        foreach (string scope in appSettings.Authentication.Schemes.OpenIdConnect.Scopes)
        {
            options.Scope.Add(scope);
        }

        options.Events = new OpenIdConnectEvents
        {
            OnRedirectToIdentityProvider = context =>
            {
                context.ProtocolMessage.SetParameter("audience",
                    appSettings.Authentication.Schemes.OpenIdConnect.ValidAudiences[0]);
                return Task.FromResult(0);
            },
            OnRedirectToIdentityProviderForSignOut = (context) =>
            {
                string logoutUri =
                    $"{appSettings.Authentication.Schemes.OpenIdConnect.Authority}/v2/logout?client_id={appSettings.Authentication.Schemes.OpenIdConnect.ClientId}";

                string? postLogoutUri = context.Properties.RedirectUri;
                if (!string.IsNullOrEmpty(postLogoutUri))
                {
                    if (string.Equals(postLogoutUri, "/agency-portal", StringComparison.Ordinal))
                    {
                        postLogoutUri = appSettings.AgencyPortalSpaUrl;
                    }

                    logoutUri += $"&returnTo={Uri.EscapeDataString(postLogoutUri)}";
                }

                context.Response.Redirect(logoutUri);
                context.HandleResponse();

                return Task.CompletedTask;
            }
        };
    })
    .AddJwtBearer()
    .AddPolicyScheme("MultiAuthSchemes", "Multi Auth Schemes", options =>
    {
        options.ForwardDefaultSelector = context =>
        {
            string? authorization = context.Request.Headers.Authorization;
            if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer ", StringComparison.Ordinal))
            {
                return "Bearer";
            }

            return CookieAuthenticationDefaults.AuthenticationScheme;
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy(AuthPolicyNames.CreateUserPolicy, policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "write:users");
    });

builder.Services.AddOpenTelemetry().UseAzureMonitor(options =>
{
    options.ConnectionString = appSettings.AzureMonitor.ConnectionString;
    options.SamplingRatio = 0.5F;
    options.Credential = new DefaultAzureCredential();
});

builder.Services.AddHealthChecks()
.AddMongoDb(appSettings.QuestionDb.ConnectionString, appSettings.QuestionDb.DatabaseName, HealthStatus.Degraded)
.AddApplicationInsightsPublisher();

builder.Services.ConfigureHttpJsonOptions(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.Configure<JsonOptions>(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddIdGen(3);

var app = builder.Build();
app.UseForwardedHeaders();
app.UseCors(agencyPortalSpaPolicy);

var mobileGroupBuilder = app.MapGroup("/mobile");
mobileGroupBuilder.MapGroup("questions").MapMobileEndpoints<QuestionModule>().RequireAuthorization();
mobileGroupBuilder.MapMobileEndpoints<FileModule>().RequireAuthorization();
mobileGroupBuilder.MapGroup("users").MapMobileEndpoints<UserModule>().RequireAuthorization();

var backofficeGroupBuilder = app.MapGroup("/management");
backofficeGroupBuilder.MapGroup("questions").MapBackOfficeEndpoints<QuestionModule>().RequireAuthorization().AsBffApiEndpoint();
backofficeGroupBuilder.MapGroup("files").MapBackOfficeEndpoints<FileModule>().RequireAuthorization().AsBffApiEndpoint();
backofficeGroupBuilder.MapGroup("users").MapBackOfficeEndpoints<UserModule>().RequireAuthorization().AsBffApiEndpoint();
backofficeGroupBuilder.MapGroup("payment").MapBackOfficeEndpoints<PaymentModule>().RequireAuthorization().AsBffApiEndpoint();

var integrationGroupBuilder = app.MapGroup("/integration");
integrationGroupBuilder.MapIntegrationEndpoints<UserModule>().RequireAuthorization();

// Redirect after login
app.MapGet("/agency-portal", (HttpRequest _) => TypedResults.Redirect(appSettings.AgencyPortalSpaUrl, permanent: true))
    .WithSummary("Redirect after user login via portal")
    .WithOpenApi();

FileModule.Configure(app);

app.UseTranchySwagger(appSettings);
app.UseTranchyExceptionHandler();

app.UseAuthentication();
app.UseBff();
app.UseAuthorization();
app.MapBffManagementEndpoints();
app.MapTranchyHealthChecks();

app.UseHubs();
app.Run();
