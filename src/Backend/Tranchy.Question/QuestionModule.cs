using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Entities;
using Tranchy.Common;
using Tranchy.Question.Data;

namespace Tranchy.Question
{
    public class QuestionModuleOptions
    {
        public DatabaseOptions QuestionDb { get; set; } = default!;

        public string ServiceBusConnectionString { get; set; } = default!;
    }

    public class DatabaseOptions
    {
        public string DatabaseName { get; set; } = default!;

        public string ConnectionString { get; set; } = default!;
    }

    public class QuestionModule : IModule
    {
        public static void ConfigureServices(IServiceCollection services, IConfigurationSection configuration)
        {
            var options = new QuestionModuleOptions();
            configuration.Bind(options);

            ConfigureDb(options.QuestionDb);

            services.AddScoped<QuestionDbContext>();
            services.AddMassTransit(c =>
            {
                c.AddMongoDbOutbox(o =>
                {
                    o.DisableInboxCleanupService();
                    o.ClientFactory(provider => DB.Database(options.QuestionDb.DatabaseName).Client);
                    o.DatabaseFactory(provider => DB.Database(options.QuestionDb.DatabaseName));
                    o.UseBusOutbox();
                });

                c.SetKebabCaseEndpointNameFormatter();
                c.UsingAzureServiceBus((ctx, cfg) =>
                {
                    cfg.Host(options.ServiceBusConnectionString);
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

            DB.DatabaseFor<Data.Question>(databaseOptions.DatabaseName);
        }
    }
}
