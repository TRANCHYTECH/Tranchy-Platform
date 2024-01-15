using Azure.Identity;
using MassTransit;
using MongoDB.Entities;
using Tranchy.Common;
using Tranchy.File;
using Tranchy.File.Consumers;
using Tranchy.Payment;
using Tranchy.Question;
using Tranchy.Question.Consumers;
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
            c.ConfigureHealthCheckOptions(cfg => cfg.MinimalFailureStatus = Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Degraded);
            // c.AddEntityFrameworkOutbox<PaymentDbContext>(o =>
            // {
            //     o.UseSqlServer();
            //     o.UseBusOutbox();
            // });

            c.AddMongoDbOutbox(o =>
            {
                o.ClientFactory(_ => DB.Database(configuration.QuestionDb.DatabaseName).Client);
                o.DatabaseFactory(_ => DB.Database(configuration.QuestionDb.DatabaseName));
                o.UseBusOutbox();
            });

            string endpointPrefix = string.Equals(configuration.ASPNETCORE_ENVIRONMENT, Environments.Development, StringComparison.Ordinal)
                ? Environment.UserName
                : string.Empty;
            c.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter(prefix: endpointPrefix, includeNamespace: false));
            c.AddConsumersFromNamespaceContaining<QuestionFileUploadedConsumer>();
            c.AddConsumersFromNamespaceContaining<DefaultAvatarGenerationConsumer>();
            c.UsingAzureServiceBus((ctx, factoryConfig) =>
            {
                factoryConfig.Host(configuration.ServiceBusConnectionString, hostConfig => hostConfig.TokenCredential = new DefaultAzureCredential());
                factoryConfig.ConfigureEndpoints(ctx);
            });
        });
    }
}
