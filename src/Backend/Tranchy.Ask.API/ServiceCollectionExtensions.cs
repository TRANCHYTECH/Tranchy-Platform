using MassTransit;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Entities;
using Tranchy.Payment.Activities;
using Tranchy.Question;
using Tranchy.Question.Data;

namespace Tranchy.Ask.API
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterInfrastructure(this IServiceCollection services, AppSettings options, QuestionModule module)
        {
            ConfigureDb(options.QuestionDb);

            //var conn = MongoClientSettings.FromConnectionString(options.QuestionDb.ConnectionString);
            //services.AddSingleton(p => p.GetRequiredService<IMongoClient>().GetDatabase(options.QuestionDb.DatabaseName));
            //services.AddSingleton<IMongoClient>(_ => new MongoClient(conn));
            services.AddScoped<QuestionDbContext>();
            services.AddMassTransit(c =>
            {
                c.AddMongoDbOutbox(o =>
                {
                    o.DisableInboxCleanupService();
                    //o.ClientFactory(provider => provider.GetRequiredService<IMongoClient>());
                    //o.DatabaseFactory(provider => provider.GetRequiredService<IMongoDatabase>());
                    o.ClientFactory(provider => DB.Database(options.QuestionDb.DatabaseName).Client);
                    o.DatabaseFactory(provider => DB.Database(options.QuestionDb.DatabaseName));
                    o.UseBusOutbox();
                });

                //c.AddConsumer<NotifyAgencyConsumer>();
                //c.AddConsumer<VerifyQuestionConsumer>();
                //c.AddConsumersFromNamespaceContaining<NotifyAgencyConsumer>();
                //c.AddActivity<ProcessPaymentActivity, ProcessPaymentArguments, ProcessPaymentLog>();
                //c.AddActivity<MakeCoffeeActivity, MakeCoffeeArguments, MakeCoffeeLog>();
                c.AddActivitiesFromNamespaceContaining<ProcessPaymentActivity>();
                c.SetKebabCaseEndpointNameFormatter();
                c.UsingAzureServiceBus((ctx, cfg) =>
                {
                    cfg.Host(options.ServiceBusConnectionString);
                    // cfg.ConfigureEndpoints(ctx);
                    //cfg.ReceiveEndpoint(module.VerifyQuestionQueue, ec =>
                    //{
                    //    ec.MaxSizeInMegabytes = 5120;
                    //    ec.DefaultMessageTimeToLive = TimeSpan.FromDays(5);

                    //    ec.UseMessageRetry(x => x.Interval(5, TimeSpan.FromSeconds(1)));
                    //    ec.UseDelayedRedelivery(x => x.Incremental(5, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5)));

                    //    ec.ConfigureConsumer<VerifyQuestionConsumer>(ctx);
                    //});

                    //cfg.ReceiveEndpoint("process-payment", ec =>
                    //{
                    //    ec.ExecuteActivityHost<ProcessPaymentActivity, ProcessPaymentArguments>(ctx);
                    //});
                    //cfg.ReceiveEndpoint("make-coffee", ec =>
                    //{
                    //    ec.ExecuteActivityHost<MakeCoffeeActivity, MakeCoffeeArguments>(ctx);
                    //});
                    //cfg.ReceiveEndpoint("ship-coffee", ec =>
                    //{
                    //    ec.ExecuteActivityHost<ShipCoffeeActivity, ShipCoffeeArguments>(ctx);
                    //});
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
