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

            _logger.LogInformation("Charged customer a payment {money}", context.Arguments.Value);
            return context.CompletedWithVariables<ProcessPaymentLog>(new { Value = context.Arguments.Value }, new { Value = context.Arguments.Value });
        }

        public async Task<CompensationResult> Compensate(CompensateContext<ProcessPaymentLog> context)
        {
            await Task.Delay(100);

            _logger.LogInformation("Reverted money of customer {money}", context.Log.Value);
            return context.Compensated();
        }
    }
}