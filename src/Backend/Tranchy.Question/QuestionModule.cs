using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;
using MongoDB.Entities;
using Tranchy.Question.Data;
using Tranchy.Question.Validators;

namespace Tranchy.Question;

public class QuestionModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
    {
        ConfigureDb(configuration.QuestionDb);

        services.AddScoped<QuestionDbContext>();
        AddValidators(services);
    }

    public static void ConfigureDb(DatabaseOptions databaseOptions)
    {
        var conventionPack = new ConventionPack
        {
            new IgnoreExtraElementsConvention(true),
        };

        ConventionRegistry.Register("TranchyAskDefaultConventions", conventionPack, _ => true);
        using var loggerFactory = LoggerFactory.Create(b =>
        {
            b.AddSimpleConsole();
            b.SetMinimumLevel(LogLevel.Debug);
        });
        var conn = MongoClientSettings.FromConnectionString(databaseOptions.ConnectionString);
        conn.LoggingSettings = new LoggingSettings(loggerFactory);
        DB.InitAsync(databaseOptions.DatabaseName, conn).Wait(cancellationToken: default);

        DB.DatabaseFor<Data.Question>(databaseOptions.DatabaseName);
        DB.DatabaseFor<QuestionCategory>(databaseOptions.DatabaseName);
        DB.DatabaseFor<QuestionPriority>(databaseOptions.DatabaseName);
    }

    private static void AddValidators(IServiceCollection serviceCollection)
    {
        ValidatorOptions.Global.DefaultRuleLevelCascadeMode = CascadeMode.Stop;
        serviceCollection.AddValidatorsFromAssemblyContaining<QuestionValidator>();
    }
}
