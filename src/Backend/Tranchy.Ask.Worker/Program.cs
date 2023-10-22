using MassTransit;
using Tranchy.Payment.Activities;
using Tranchy.Question.Consumers;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddMassTransit(c =>
{
    c.SetKebabCaseEndpointNameFormatter();
    c.AddActivitiesFromNamespaceContaining<ProcessPaymentActivity>();
    c.AddConsumersFromNamespaceContaining<QuestionFileUploadedConsumer>();
    c.UsingAzureServiceBus((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration.GetValue<string>("ServiceBusConnectionString"));
        cfg.ConfigureEndpoints(ctx);
    });
});

var host = builder.Build();

host.Run();
