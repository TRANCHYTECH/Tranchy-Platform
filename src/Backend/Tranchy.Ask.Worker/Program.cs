using MassTransit;
using Tranchy.Payment.Activities;
using Tranchy.Question.Consumers;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddMassTransit(c =>
{
    c.SetKebabCaseEndpointNameFormatter();

    c.AddActivitiesFromNamespaceContaining<ProcessPaymentActivity>();

    // Issue: call c.AddConsumersFromNamespaceContaining() and c.AddActivitiesFromNamespaceContaining caused missed consumers. Therefore register one by one.
    c.AddConsumer<QuestionFileUploadedConsumer>();
    c.AddConsumer<VerifyQuestionConsumer>();
    c.AddConsumer<NotifyAgencyConsumer>();

    c.UsingAzureServiceBus((ctx, cfg) =>
    {
        cfg.Host(builder.Configuration.GetValue<string>("ServiceBusConnectionString"));
        cfg.ConfigureEndpoints(ctx);
    });
});

var host = builder.Build();

host.Run();
