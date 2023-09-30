using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Tranchy.Common;
using Tranchy.Payment.Activities;
using Tranchy.Payment.Data;

namespace Tranchy.Payment.Endpoints
{
    public class BuyCoffeeInput
    {
        public decimal Money { get; init; }
    }

    public class BuyCoffeeOutput
    {

    }

    public class MigrateDatabase : IEndpoint
    {
        public static async Task<Ok<string>> Migrate(
           [FromServices] PaymentDbContext paymentDbContext)
        {
            await paymentDbContext.Database.MigrateAsync();

            return TypedResults.Ok("Migrated");
        }

        public static void Register(RouteGroupBuilder routeGroupBuilder)
        {
            routeGroupBuilder.MapGet("/migrate", Migrate).ExcludeFromDescription().WithName("MigrateDb");
        }
    }

    public class BuyCoffee : IEndpoint
    {
        public static async Task<Ok<BuyCoffeeOutput>> Buy(
            [FromBody] BuyCoffeeInput input,
            [FromServices] PaymentDbContext paymentDbContext,
            [FromServices] IEndpointNameFormatter endpointNameFormatter,
            [FromServices] IBus bus)
        {
            var test = paymentDbContext.Deposits.ToList();
            var builder = new RoutingSlipBuilder(NewId.NextGuid());
            builder.AddActivity(nameof(ProcessPaymentActivity), new Uri($"queue:{endpointNameFormatter.ExecuteActivity<ProcessPaymentActivity, ProcessPaymentArguments>()}"), new { Value = input.Money });
            builder.AddActivity(nameof(MakeCoffeeActivity), new Uri($"queue:{endpointNameFormatter.ExecuteActivity<MakeCoffeeActivity, MakeCoffeeArguments>()}"), new { NumberOfCups = 10 });
            builder.AddActivity(nameof(ShipCoffeeActivity), new Uri($"queue:{endpointNameFormatter.ExecuteActivity<ShipCoffeeActivity, ShipCoffeeArguments>()}"), new { NumberOfCups = 10 });

            var routingSlip = builder.Build();

            await bus.Execute(routingSlip);

            return TypedResults.Ok<BuyCoffeeOutput>(new());
        }

        public static void Register(RouteGroupBuilder routeGroupBuilder)
        {
            routeGroupBuilder.MapPost("/buy", Buy).WithName("BuyCoffee");
        }
    }
}
