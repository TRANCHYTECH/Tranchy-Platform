using MassTransit;
using MongoDB.Entities;
using Tranchy.Payment.Activities;

namespace Tranchy.Ask.API
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterInfrastructure(this IServiceCollection services, AppSettings options)
        {
            services.AddMassTransit(c =>
            {
                c.AddMongoDbOutbox(o =>
                {
                    o.ClientFactory(provider => DB.Database(options.QuestionDb.DatabaseName).Client);
                    o.DatabaseFactory(provider => DB.Database(options.QuestionDb.DatabaseName));
                    o.UseBusOutbox();
                });

                c.AddActivitiesFromNamespaceContaining<ProcessPaymentActivity>();
                c.SetKebabCaseEndpointNameFormatter();
                c.UsingAzureServiceBus((ctx, cfg) =>
                {
                    cfg.Host(options.ServiceBusConnectionString);
                });
            });
        }
    }
}
