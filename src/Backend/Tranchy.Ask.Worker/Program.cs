using MassTransit;
using Tranchy.Question.Consumers;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddMassTransit(c =>
{
    c.SetKebabCaseEndpointNameFormatter();

    c.AddConsumersFromNamespaceContaining<QuestionFileUploadedConsumer>();
    // Issue: call c.AddConsumersFromNamespaceContaining() and c.AddActivitiesFromNamespaceContaining caused missed consumers in container apps env.

    c.UsingAzureServiceBus((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration.GetValue<string>("ServiceBusConnectionString"));
        cfg.ConfigureEndpoints(ctx);
    });
});

var host = builder.Build();

host.Run();
