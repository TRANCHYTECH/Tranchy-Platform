namespace Tranchy.Payment.Activities
{
    using System.Threading.Tasks;
    using MassTransit;
    using Microsoft.Extensions.Logging;

    public class ProcessPaymentActivity :
        IActivity<ProcessPaymentArguments, ProcessPaymentLog>
    {
        private readonly ILogger<ProcessPaymentActivity> _logger;

        public ProcessPaymentActivity(ILogger<ProcessPaymentActivity> logger)
        {
            _logger = logger;
        }

        public async Task<ExecutionResult> Execute(ExecuteContext<ProcessPaymentArguments> context)
        {
            await Task.Delay(100);

            _logger.LogInformation("Process Payment OK");
            return context.Completed();
        }

        public async Task<CompensationResult> Compensate(CompensateContext<ProcessPaymentLog> context)
        {
            await Task.Delay(100);
            
            return context.Compensated();
        }
    }
}