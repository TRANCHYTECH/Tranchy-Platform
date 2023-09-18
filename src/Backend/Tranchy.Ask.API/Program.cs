using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Tranchy.Question;
using Tranchy.Ask.API;
using Tranchy.Payment;

const string AgencyPortalSpaPolicy = "agencyportalspa";

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(options => options.AddServerHeader = false);
builder.Services.Configure<ForwardedHeadersOptions>(options => options.ForwardedHeaders = ForwardedHeaders.XForwardedHost | ForwardedHeaders.XForwardedProto);
var appSettings = new AppSettings();
builder.Configuration.Bind(appSettings);
builder.Services.AddOptions<AppSettings>().Configure(c => c = appSettings);

var questionModule = new QuestionModule();
builder.Configuration.GetSection(nameof(QuestionModule)).Bind(questionModule);
builder.Services.AddSingleton(questionModule);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(AgencyPortalSpaPolicy,
                      builder =>
                      {
                          builder
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

// builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = "MultiAuthSchemes";
    options.DefaultChallengeScheme = "MultiAuthSchemes";
    // options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    // options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    // options.DefaultSignOutScheme = OpenIdConnectDefaults.AuthenticationScheme;
}).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
{
    // host prefixed cookie name
    options.Cookie.Name = "__Host.Web.Ask";

    // strict SameSite handling
    options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict;
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
    foreach (var scope in appSettings.Authentication.Schemes.OpenIdConnect.Scopes)
    {
        options.Scope.Add(scope);
    }

    options.Events = new OpenIdConnectEvents
    {
        OnRedirectToIdentityProvider = context =>
        {
            context.ProtocolMessage.SetParameter("audience", appSettings.Authentication.Schemes.OpenIdConnect.ValidAudience);
            return Task.FromResult(0);
        },
        OnRedirectToIdentityProviderForSignOut = (context) =>
        {
            var logoutUri = $"{appSettings.Authentication.Schemes.OpenIdConnect.Authority}/v2/logout?client_id={appSettings.Authentication.Schemes.OpenIdConnect.ClientId}";

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
})
.AddJwtBearer()
.AddPolicyScheme("MultiAuthSchemes", "Multi Auth Schemes", options =>
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
    });

builder.Services.AddAuthorization();

builder.Services.RegisterInfrastructure(appSettings, questionModule);

builder.Services.AddGraphQLServer();
QuestionModule.Register(builder.Services);

var app = builder.Build();
app.UseForwardedHeaders();

app.UseCors(AgencyPortalSpaPolicy);

var questionEndpointBuilder = app.MapGroup("/question").MapEndpoints<QuestionModule>().RequireAuthorization().AsBffApiEndpoint();
var paymentEndpointBuilder = app.MapGroup("/payment").MapEndpoints<PaymentModule>().RequireAuthorization().AsBffApiEndpoint();
{
    questionEndpointBuilder.SkipAntiforgery();
    paymentEndpointBuilder.SkipAntiforgery();
}

// Redirect after login
app.MapGet("/agency-portal", (HttpRequest req) =>
{
    return TypedResults.Redirect(appSettings.AgencyPortalSpaUrl, true);
});

//app.MapGet("antiforgery/token", (IAntiforgery forgeryService, HttpContext context) =>
//{
//    var tokens = forgeryService.GetAndStoreTokens(context);
//    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!,
//            new CookieOptions { HttpOnly = false });

//    return Results.Ok();
//}).RequireAuthorization().AsBffApiEndpoint().SkipAntiforgery();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseBff();
app.UseAuthorization();
app.MapBffManagementEndpoints();

app.MapGraphQL();

app.Run();
