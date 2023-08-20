namespace Tranchy.Payment.Activities
{
    using System.Threading.Tasks;
    using MassTransit;
    using Microsoft.Extensions.Logging;

    public class MakeCoffeeActivity :
        IActivity<MakeCoffeeArguments, MakeCoffeeLog>
    {
        private readonly ILogger<MakeCoffeeActivity> _logger;

        public MakeCoffeeActivity(ILogger<MakeCoffeeActivity> logger)
        {
            this._logger = logger;
        }

        public async Task<ExecutionResult> Execute(ExecuteContext<MakeCoffeeArguments> context)
        {
            await Task.Delay(10);
            _logger.LogInformation("Made {number} cups of coffee", context.Arguments.NumberOfCups);

            return context.Completed<MakeCoffeeLog>(new { NumberOfCups = context.Arguments.NumberOfCups });
        }

        public async Task<CompensationResult> Compensate(CompensateContext<MakeCoffeeLog> context)
        {
            await Task.Delay(100);

            _logger.LogInformation("Reported to destroy {number} cups of coffee", context.Log.NumberOfCups);

            return context.Compensated();
        }
    }
}