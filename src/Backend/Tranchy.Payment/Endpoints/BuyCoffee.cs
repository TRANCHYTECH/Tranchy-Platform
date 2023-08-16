using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Tranchy.Common;
using Tranchy.Payment.Activities;

namespace Tranchy.Payment.Endpoints
{
    public class BuyCoffeeInput
    {
        public decimal Money { get; init; }
    }

    public class BuyCoffeeOutput
    {

    }

    public class BuyCoffee : IEndpoint
    {
        public static async Task<Ok<BuyCoffeeOutput>> Buy([FromBody] BuyCoffeeInput input, [FromServices] IBus bus)
        {
            var builder = new RoutingSlipBuilder(NewId.NextGuid());
            builder.AddActivity("ProcessPayment", new Uri("queue:process-payment"), new { Value = input.Money });
            builder.AddActivity("MakeCoffee", new Uri("queue:make-coffee"), new { NumberOfCups = 10 });

            var routingSlip = builder.Build();

            await bus.Execute(routingSlip);

            return TypedResults.Ok<BuyCoffeeOutput>(new());
        }

        public static void Register(RouteGroupBuilder routeGroupBuilder)
        {
            routeGroupBuilder.MapPost("/buy", Buy);
        }
    }
}
