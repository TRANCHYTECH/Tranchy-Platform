using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Tranchy.Common
{
    public interface IModule
    {
        abstract static void ConfigureServices(IServiceCollection services, AppSettings configuration);
    }
}
