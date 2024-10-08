using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Tranchy.Common;
using Tranchy.Common.Constants;

namespace Tranchy.Ask.API;

public class DefaultHeaderFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (operation.Tags.Any(t => string.Equals(t.Name, Tags.BackOffice, StringComparison.Ordinal)) &&
            operation.Parameters.All(p => !string.Equals(p.Name, "x-csrf", StringComparison.Ordinal)))
        {
            operation.Parameters.Add(new OpenApiParameter
            {
                Name = "x-csrf", In = ParameterLocation.Header, Required = true, Example = new OpenApiString("1")
            });
        }
    }
}

public static class SwaggerExtensions
{
    public static void AddTranchySwagger(this IServiceCollection services, AppSettings appSettings)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.EnableAnnotations(true, true);
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
                        Scopes =
                            appSettings.Authentication.Schemes.Swagger.Scopes.ToDictionary(k => k, v => v,
                                StringComparer.Ordinal),
                        AuthorizationUrl =
                            new Uri(appSettings.Authentication.Schemes.Swagger.AuthorizationUrl!),
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
