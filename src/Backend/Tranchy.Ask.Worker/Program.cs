using Azure.Identity;
using MassTransit;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Tranchy.Common;
using Tranchy.Question;
using Tranchy.Question.Consumers;

var builder = Host.CreateApplicationBuilder(args);
builder.Configuration.AddAzureAppConfiguration(options =>
    {
        string? appConfigName = builder.Configuration["AppConfigName"];
        options.Connect(new Uri($"https://{appConfigName}.azconfig.io"), new DefaultAzureCredential())
        .Select(KeyFilter.Any, builder.Environment.EnvironmentName);
        options.ConfigureKeyVault(options => options.SetCredential(new DefaultAzureCredential()));
    });
builder.Services.AddAzureClients(config =>
{
    string? vault = builder.Configuration["KeyVaultName"];
    config.UseCredential(new DefaultAzureCredential());
    config.AddSecretClient(new Uri($"https://{vault}.vault.azure.net"));
});

var appSettings = new AppSettings();
builder.Configuration.Bind(appSettings);
builder.Services.Configure<AppSettings>(builder.Configuration);

QuestionModule.ConfigureDb(appSettings.QuestionDb);

builder.Services.AddMassTransit(c =>
{
    c.SetKebabCaseEndpointNameFormatter();

    c.AddConsumersFromNamespaceContaining<QuestionFileUploadedConsumer>();
    // Issue: call c.AddConsumersFromNamespaceContaining() and c.AddActivitiesFromNamespaceContaining caused missed consumers in container apps env.

    c.UsingAzureServiceBus((ctx, cfg) =>
    {
        cfg.Host(appSettings.ServiceBusConnectionString);
        cfg.ConfigureEndpoints(ctx);
    });
});

var host = builder.Build();

host.Run();
