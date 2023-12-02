using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Entities;

namespace Tranchy.User;

public class UserModule : IModule
{
    public static void ConfigureServices(IServiceCollection services, AppSettings configuration)
    {
        // Temporarily uses QuestionDb
        ConfigureDb(configuration.QuestionDb);
    }

    public static void ConfigureDb(DatabaseOptions databaseOptions)
    {
        var conventionPack = new ConventionPack
        {
            new IgnoreExtraElementsConvention(true),
        };

        ConventionRegistry.Register("TranchyAskDefaultConventions", conventionPack, _ => true);
        var conn = MongoClientSettings.FromConnectionString(databaseOptions.ConnectionString);
        DB.InitAsync(databaseOptions.DatabaseName, conn).Wait(cancellationToken: default);
        DB.DatabaseFor<Data.User>(databaseOptions.DatabaseName);
    }
}
