using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tranchy.Common.Exceptions;

namespace Tranchy.Common;

public static class ApplicationBuilderExtensions
{
    public static void UseTranchyExceptionHandler(this IApplicationBuilder app) =>
        app.UseExceptionHandler(configure => configure.Run(async context =>
        {
            var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            if (exceptionHandlerPathFeature?.Error is TranchyAteChillyException ex)
            {
                await Results.BadRequest(new ErrorDetails { Error = ex.Message }).ExecuteAsync(context);
            }
        }));

    public static void AddTranchyKeyVault(this WebApplicationBuilder builder, string prefix)
    {
        var vaultKeys = builder.Configuration.AsEnumerable()
            .Where(secret => secret.Value?.Equals("<KeyVault>", StringComparison.OrdinalIgnoreCase) ?? false)
            .Select(secret => secret.Key)
            .ToList();

        builder.Configuration.AddAzureKeyVault(
            builder.GetKeyVaultUrl(),
            builder.Environment.GetTokenCredential(), new TranchyKeyVaultSecretManager(prefix, vaultKeys));
    }

    public static void AddTestPlatformDataProtection(this WebApplicationBuilder builder, string applicationName)
    {
        Uri storageUri = new($"https://{builder.Configuration["BlobStorageName"]}.blob.core.windows.net");
        builder.Services.AddDataProtection()
            .SetApplicationName(applicationName)
            .PersistKeysToAzureBlobStorage(new Uri(storageUri, $"{builder.Configuration.GetValue<string>("DataProtection:FileName")}"), builder.Environment.GetTokenCredential())
            .ProtectKeysWithAzureKeyVault(new Uri(builder.GetKeyVaultUrl(), $"keys/{builder.Configuration.GetValue<string>("DataProtection:KeyName")}"), builder.Environment.GetTokenCredential());
    }

    private static Uri GetKeyVaultUrl(this WebApplicationBuilder builder)
    {
        return new Uri($"https://{builder.Configuration["KeyVaultName"]}.vault.azure.net/");
    }
}
