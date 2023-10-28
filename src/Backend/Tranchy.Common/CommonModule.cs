using Microsoft.Extensions.DependencyInjection;
using Tranchy.Common.Services;
using Tranchy.Common.Validators;

namespace Tranchy.Common
{
    public class CommonModule : IModule
    {
        public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
        {
            services.AddScoped<ITenant, Tenant>();
            services.AddScoped(typeof(IValidator<>), typeof(Validator<>));
        }
    }
}
