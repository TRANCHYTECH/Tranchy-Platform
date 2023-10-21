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
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;

const string agencyPortalSpaPolicy = "agency-portal-spa";

var builder = WebApplication.CreateBuilder(args);
builder.WebHost
    .ConfigureKestrel(options => options.AddServerHeader = false)
    .ConfigureAppConfiguration(config =>
    {
        config.AddAzureAppConfiguration(options =>
        {
            var appConfigName = builder.Configuration["AppConfigName"];
            options
                .Connect(
                    new Uri($"https://{appConfigName}.azconfig.io"),
                    new DefaultAzureCredential()
                )
                .Select(KeyFilter.Any, builder.Environment.EnvironmentName);
            options.ConfigureKeyVault(options =>
            {
                options.SetCredential(new DefaultAzureCredential());
            });
        });
    });
builder.Services.AddAzureClients(config =>
{
    var vault = builder.Configuration["KeyVaultName"];
    config.UseCredential(new DefaultAzureCredential());
    config.AddSecretClient(new Uri($"https://{vault}.vault.azure.net"));
});
builder.Services.Configure<ForwardedHeadersOptions>(
    options =>
        options.ForwardedHeaders =
            ForwardedHeaders.XForwardedHost | ForwardedHeaders.XForwardedProto
);

var appSettings = new AppSettings();
builder.Configuration.Bind(appSettings);
builder.Services.AddOptions<AppSettings>().Configure(c => c = appSettings);

builder.Services.RegisterModules(appSettings);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MyAPI", Version = "v1" });
    opt.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter token",
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            BearerFormat = "JWT",
            Scheme = "bearer"
        }
    );
    opt.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        }
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        agencyPortalSpaPolicy,
        policyBuilder =>
        {
            policyBuilder
                .WithOrigins(appSettings.AgencyPortalSpaUrl)
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

builder.Services.AddBff(options =>
{
    options.BackchannelLogoutAllUserSessions = true;
    options.EnableSessionCleanup = true;
});

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = "MultiAuthSchemes";
        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
        options.DefaultSignOutScheme = OpenIdConnectDefaults.AuthenticationScheme;
        // options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(
        CookieAuthenticationDefaults.AuthenticationScheme,
        options =>
        {
            // host prefixed cookie name
            options.Cookie.Name = "__Host.Web.Ask";

            // strict SameSite handling
            options.Cookie.SameSite = SameSiteMode.Strict;
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        }
    )
    .AddOpenIdConnect(
        OpenIdConnectDefaults.AuthenticationScheme,
        options =>
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
            foreach (var scope in appSettings.Authentication.Schemes.OpenIdConnect.Scopes)
            {
                options.Scope.Add(scope);
            }

            options.Events = new OpenIdConnectEvents
            {
                OnRedirectToIdentityProvider = context =>
                {
                    context.ProtocolMessage.SetParameter(
                        "audience",
                        appSettings.Authentication.Schemes.OpenIdConnect.ValidAudience
                    );
                    return Task.FromResult(0);
                },
                OnRedirectToIdentityProviderForSignOut = (context) =>
                {
                    var logoutUri =
                        $"{appSettings.Authentication.Schemes.OpenIdConnect.Authority}/v2/logout?client_id={appSettings.Authentication.Schemes.OpenIdConnect.ClientId}";

                    var postLogoutUri = context.Properties.RedirectUri;
                    if (!string.IsNullOrEmpty(postLogoutUri))
                    {
                        if (postLogoutUri == "/agency-portal")
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
        }
    )
    .AddJwtBearer()
    .AddPolicyScheme(
        "MultiAuthSchemes",
        "Multi Auth Schemes",
        options =>
        {
            options.ForwardDefaultSelector = context =>
            {
                string? authorization = context.Request.Headers.Authorization;
                if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
                {
                    return "Bearer";
                }

                return CookieAuthenticationDefaults.AuthenticationScheme;
            };
        }
    );

builder.Services.AddAuthorization();

builder.Services
    .AddOpenTelemetry()
    .UseAzureMonitor(options =>
    {
        options.ConnectionString = appSettings.AzureMonitor.ConnectionString;
        options.SamplingRatio = 0.5F;
        options.Credential = new DefaultAzureCredential();
    });

builder.Services
    .AddHealthChecks()
    .AddMongoDb(
        appSettings.QuestionDb.ConnectionString,
        appSettings.QuestionDb.DatabaseName,
        HealthStatus.Degraded
    )
    .AddApplicationInsightsPublisher();

var app = builder.Build();
app.UseForwardedHeaders();
app.UseCors(agencyPortalSpaPolicy);

var questionEndpointBuilder = app.MapGroup("/question")
    .MapEndpoints<QuestionModule>()
    //.RequireAuthorization()
    .AsBffApiEndpoint();
var paymentEndpointBuilder = app.MapGroup("/payment")
    .MapEndpoints<PaymentModule>()
    .RequireAuthorization()
    .AsBffApiEndpoint();

{
    questionEndpointBuilder.SkipAntiforgery();
    paymentEndpointBuilder.SkipAntiforgery();
}

// Redirect after login
app.MapGet(
    "/agency-portal",
    (HttpRequest req) => TypedResults.Redirect(appSettings.AgencyPortalSpaUrl, true)
);

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseBff();
app.UseAuthorization();
app.MapBffManagementEndpoints();
app.MapTranchyHealthChecks();

app.Run();
