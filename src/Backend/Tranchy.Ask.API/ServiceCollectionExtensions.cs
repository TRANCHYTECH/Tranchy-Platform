using MassTransit;
using MongoDB.Entities;
using Tranchy.Common;
using Tranchy.File;
using Tranchy.Payment;
using Tranchy.Question;
using Tranchy.User;

namespace Tranchy.Ask.API;

public static class ServiceCollectionExtensions
{
    public static void RegisterModules(this IServiceCollection services, AppSettings configuration)
    {
        CommonModule.ConfigureServices(services, configuration);
        QuestionModule.ConfigureServices(services, configuration);
        FileModule.ConfigureServices(services, configuration);
        PaymentModule.ConfigureServices(services, configuration);
        UserModule.ConfigureServices(services, configuration);
        services.AddMassTransit(c =>
        {
            c.ConfigureHealthCheckOptions(cfg => cfg.FailureStatus = Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded);
            // c.AddEntityFrameworkOutbox<PaymentDbContext>(o =>
            // {
            //     o.UseSqlServer();
            //     o.UseBusOutbox();
            // });

            c.AddMongoDbOutbox(o =>
            {
                o.ClientFactory(provider => DB.Database(configuration.QuestionDb.DatabaseName).Client);
                o.DatabaseFactory(provider => DB.Database(configuration.QuestionDb.DatabaseName));

                // todo: check error when enable the service
                o.UseBusOutbox(c => c.DisableDeliveryService());
            });

            c.SetKebabCaseEndpointNameFormatter();

            c.UsingAzureServiceBus((ctx, cfg) => cfg.Host(configuration.ServiceBusConnectionString));
        });
    }
}
