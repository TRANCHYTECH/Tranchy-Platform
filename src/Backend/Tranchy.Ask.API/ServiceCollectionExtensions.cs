using MassTransit;
using MongoDB.Entities;
using Tranchy.Common;
using Tranchy.Payment;
using Tranchy.Payment.Data;
using Tranchy.Question;

namespace Tranchy.Ask.API
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterModules(this IServiceCollection services, AppSettings configuration)
        {
            QuestionModule.ConfigureServices(services, configuration);
            PaymentModule.ConfigureServices(services, configuration);
            services.AddMassTransit(c =>
            {
                c.AddEntityFrameworkOutbox<PaymentDbContext>(o =>
                {
                    o.UseSqlServer();
                    o.UseBusOutbox();
                });

                c.AddMongoDbOutbox(o =>
                {
                    o.ClientFactory(provider => DB.Database(configuration.QuestionDb.DatabaseName).Client);
                    o.DatabaseFactory(provider => DB.Database(configuration.QuestionDb.DatabaseName));
                    o.UseBusOutbox();
                });

                c.SetKebabCaseEndpointNameFormatter();

                c.UsingAzureServiceBus((ctx, cfg) =>
                {
                    cfg.Host(configuration.ServiceBusConnectionString);
                });
            });
        }
    }
}
