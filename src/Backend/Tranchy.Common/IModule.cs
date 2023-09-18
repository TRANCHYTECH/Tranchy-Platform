using Microsoft.Extensions.DependencyInjection;

namespace Tranchy.Common
{
    public interface IModule
    {
        abstract static void Register(IServiceCollection services);
    }
}
