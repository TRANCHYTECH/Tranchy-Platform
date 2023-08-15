using MassTransit;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Entities;
using Tranchy.Question.Consumers;
using Tranchy.Question.Data;

namespace Tranchy.Ask.API
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterInfrastructure(this IServiceCollection services, AppSettings options)
        {
            ConfigureDb(options.QuestionDb);

            var conn = MongoClientSettings.FromConnectionString(options.QuestionDb.ConnectionString);
            services.AddSingleton<IMongoDatabase>(p => p.GetRequiredService<IMongoClient>().GetDatabase(options.QuestionDb.DatabaseName));
            services.AddSingleton<IMongoClient>(_ => new MongoClient(conn));
            services.AddScoped<QuestionDbContext>();

            services.AddMassTransit(c =>
            {
                c.AddMongoDbOutbox(o =>
                {
                    o.DisableInboxCleanupService();
                    o.ClientFactory(provider => provider.GetRequiredService<IMongoClient>());
                    o.DatabaseFactory(provider => provider.GetRequiredService<IMongoDatabase>());
                o.UseBusOutbox(p => p.DisableDeliveryService());
                });

                c.AddConsumer<NotifyAgencyConsumer>();
                c.AddConsumer<VerifyQuestionConsumer>();

                c.UsingAzureServiceBus((ctx, cfg) =>
                {
                    cfg.Host(options.ServiceBusConnectionString);
                    cfg.ConfigureEndpoints(ctx);
                    cfg.ReceiveEndpoint("tranchy.question.command/notifyagencyquestionlocal", ec =>
                    {
                        ec.MaxSizeInMegabytes = 5120;
                        ec.DefaultMessageTimeToLive = TimeSpan.FromDays(5);

                        ec.UseMessageRetry(x => x.Interval(5, TimeSpan.FromSeconds(1)));
                        ec.UseDelayedRedelivery(x => x.Incremental(5, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5)));

                        ec.ConfigureConsumer<VerifyQuestionConsumer>(ctx);
                    });
                });
            });
        }

        public static void ConfigureDb(DatabaseOptions databaseOptions)
        {
            var conventionPack = new ConventionPack
            {
                new IgnoreExtraElementsConvention(true)
            };

            ConventionRegistry.Register("TranchyAskDefaultConventions", conventionPack, _ => true);

            var conn = MongoClientSettings.FromConnectionString(databaseOptions.ConnectionString);
            DB.InitAsync(databaseOptions.DatabaseName, conn).Wait();
        }
    }
}
