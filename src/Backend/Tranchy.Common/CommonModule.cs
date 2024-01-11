using Microsoft.Extensions.DependencyInjection;
using Tranchy.Common.Services;

namespace Tranchy.Common;

public class CommonModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
    {
        services.AddScoped<ITenant, Tenant>();
    }
}
