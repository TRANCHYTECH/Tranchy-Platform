using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Entities;
using Tranchy.Question.Data;

namespace Tranchy.Question;

public class QuestionModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
    {
        ConfigureDb(configuration.QuestionDb);

        services.AddScoped<QuestionDbContext>();
    }

    public static void ConfigureDb(DatabaseOptions databaseOptions)
    {
        var conventionPack = new ConventionPack
        {
            new IgnoreExtraElementsConvention(true)
        };

        ConventionRegistry.Register("TranchyAskDefaultConventions", conventionPack, _ => true);

        var conn = MongoClientSettings.FromConnectionString(databaseOptions.ConnectionString);
        DB.InitAsync(databaseOptions.DatabaseName, conn).Wait(cancellationToken: default);

        DB.DatabaseFor<Data.Question>(databaseOptions.DatabaseName);
    }
}
