using Microsoft.Extensions.DependencyInjection;

namespace Tranchy.Common;

public interface IModule
{
    static abstract void ConfigureServices(IServiceCollection services, AppSettings configuration);
}
