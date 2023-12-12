using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using Tranchy.Common;

namespace Tranchy.Ask.API;

public class DefaultHeaderFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        operation.Parameters.Add(new OpenApiParameter
        {
            Name = "x-csrf",
            In = ParameterLocation.Header,
            Required = true,
            Example = new OpenApiString("1")
        });
    }
}

public static class SwaggerExtensions
{
    public static void AddTranchySwagger(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddEndpointsApiExplorer();
        const string HmacSecretHeaderName = "X-HMAC-Secret";

        services.Configure<SwaggerUIOptions>(opts =>
        {
            // Pull in crypto-js to handle request hashing
            opts.InjectJavascript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js");
            // Request handler to
            // - pull the secret out of the specified header and remove that header from the request
            // - Set the request timestamp in a header
            // - Sign the request using HMAC
            opts.UseRequestInterceptor(
                "(req) => { if(req.url.endsWith('swagger.json')) return req; var now = Date.now(); req.headers['X-Request-Timestamp'] = now; var secret = req.headers['"+ HmacSecretHeaderName+"']; delete req.headers['"+ HmacSecretHeaderName+"']; var payload=req.method.toUpperCase()+req.url+now+req.body; var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secret); hmac.update(payload); req.headers['X-Request-Signature'] = CryptoJS.enc.Base64.stringify(hmac.finalize()); return req; }");
        });

        services.Configure<SwaggerGenOptions>(options =>
        {
            options.AddSecurityDefinition("HMAC",
                new OpenApiSecurityScheme
                {
                    Description = "HMAC request signing",
                    Type = SecuritySchemeType.ApiKey,
                    Name = HmacSecretHeaderName, // this header is removed by the request interceptor.
                    In = ParameterLocation.Header,
                });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "HMAC" }
                    },
                    Array.Empty<string>()
                }
            });
        });
        services.AddSwaggerGen(options =>
        {
            options.EnableAnnotations(enableAnnotationsForInheritance: true, enableAnnotationsForPolymorphism: true);
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Tranchy Ask Api Documentation", Version = "v1" });
            options.OperationFilter<DefaultHeaderFilter>();

            var scheme = new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Name = "Authorization",
                Flows = new OpenApiOAuthFlows
                {
                    AuthorizationCode = new OpenApiOAuthFlow
                    {
                        Scopes = appSettings.Authentication.Schemes.Swagger.Scopes.ToDictionary(k => k, v => v, StringComparer.Ordinal),
                        AuthorizationUrl = new Uri(appSettings.Authentication.Schemes.Swagger.AuthorizationUrl!),
                        TokenUrl = new Uri(appSettings.Authentication.Schemes.Swagger.TokenUrl!)
                    }
                },
                Type = SecuritySchemeType.OAuth2
            };
            options.AddSecurityDefinition("OAuth", scheme);
            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Id = "OAuth", Type = ReferenceType.SecurityScheme }
                    },
                    new List<string>()
                }
            });
        });
    }

    public static void UseTranchySwagger(this IApplicationBuilder app, AppSettings appSettings)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.OAuthClientId(appSettings.Authentication.Schemes.Swagger.ClientId);
            options.OAuthAppName("Swagger");
            options.OAuthScopes(appSettings.Authentication.Schemes.Swagger.Scopes);
            options.OAuthUsePkce();
            options.EnablePersistAuthorization();
            options.OAuthAdditionalQueryStringParams(new Dictionary<string, string>(StringComparer.Ordinal)
            {
                { "audience", appSettings.Authentication.Schemes.Swagger.ValidAudiences[0] }
            });
        });
    }
}
