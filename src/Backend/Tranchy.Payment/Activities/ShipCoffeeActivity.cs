namespace Tranchy.Payment.Activities
{
    using System.Threading.Tasks;
    using MassTransit;
    using Microsoft.Extensions.Logging;

    public class ShipCoffeeActivity :
        IExecuteActivity<ShipCoffeeArguments>
    {
        private readonly ILogger<ShipCoffeeActivity> _logger;

        public ShipCoffeeActivity(ILogger<ShipCoffeeActivity> logger)
        {
            _logger = logger;
        }
        public async Task<ExecutionResult> Execute(ExecuteContext<ShipCoffeeArguments> context)
        {
            await Task.Delay(100);
            _logger.LogWarning("Could not delivery to customer. Wrong address");
            return context.Faulted(new Exception("wrong address"));
        }
    }
}