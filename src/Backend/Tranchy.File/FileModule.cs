using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.DependencyInjection;
using SixLabors.ImageSharp.Web.Caching.Azure;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers.Azure;

namespace Tranchy.File;

public class FileModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
    {
        // todo(tau): fork this provider for azure credential. Then remove this connection string
        services.Configure<AzureBlobStorageImageProviderOptions>(options =>
        {
                // The "BlobContainers" collection allows registration of multiple containers.
                options.BlobContainers.Add(new AzureBlobContainerClientOptions
                {
                    ConnectionString = configuration.File.BlobStorageConnectionString,
                    ContainerName = "avatar"
                });
            });

        services.Configure<AzureBlobStorageCacheOptions>(options =>
        {
            options.ConnectionString = configuration.File.BlobStorageConnectionString;
                options.ContainerName = "caches";
            // Optionally create the cache container on startup if not already created.
            AzureBlobStorageCache.CreateIfNotExists(options, PublicAccessType.None);
        });

        services.AddImageSharp().ClearProviders().AddProvider<AzureBlobStorageImageProvider>().SetCache<AzureBlobStorageCache>();
    }

    public static void Configure(IApplicationBuilder app) => app.UseImageSharp();
}
