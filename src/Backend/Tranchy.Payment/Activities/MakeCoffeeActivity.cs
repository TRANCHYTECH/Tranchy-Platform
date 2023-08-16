namespace Company.Activities
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
            await Task.Delay(100);

            return context.Completed<MakeCoffeeLog>(new { NumberOfCups = 1 });
        }

        public async Task<CompensationResult> Compensate(CompensateContext<MakeCoffeeLog> context)
        {
            await Task.Delay(100);
            
            return context.Compensated();
        }
    }
}