using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using SixLabors.ImageSharp.Web.Caching.Azure;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers.Azure;

namespace Tranchy.File;

public class FileModule : IModule, IStartupFilter
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
                ContainerName = configuration.File.AvatarContainerName
            });
        });
        services.AddKeyedScoped<BlobContainerClient>("avatar",
            (sp, key) => new BlobContainerClient(configuration.File.BlobStorageConnectionString,
                configuration.File.AvatarContainerName));

        services.Configure<AzureBlobStorageCacheOptions>(options =>
        {
            options.ConnectionString = configuration.File.BlobStorageConnectionString;
            options.ContainerName = "caches";
            // Optionally create the cache container on startup if not already created.
            AzureBlobStorageCache.CreateIfNotExists(options, PublicAccessType.None);
        });

        services.AddImageSharp().ClearProviders().AddProvider<AzureBlobStorageImageProvider>()
            .SetCache<AzureBlobStorageCache>();
        services.AddTransient<IStartupFilter, FileModule>();
    }

    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) =>
        builder =>
        {
            next(builder);
            builder.UseImageSharp();
        };
}
