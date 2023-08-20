using MassTransit;
using Tranchy.Question.Consumers;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddMassTransit(c =>
{
    c.SetKebabCaseEndpointNameFormatter();
    c.AddConsumersFromNamespaceContaining<NotifyAgencyConsumer>();
    c.UsingAzureServiceBus((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration.GetValue<string>("ServiceBusConnectionString"));
        cfg.ConfigureEndpoints(ctx);
    });
});

var host = builder.Build();

host.Run();
