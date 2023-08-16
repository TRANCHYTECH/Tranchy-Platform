namespace Company.Activities
{
    using System.Threading.Tasks;
    using MassTransit;

    public class ShipCoffeeActivity :
        IActivity<ShipCoffeeArguments, ShipCoffeeLog>
    {
        public async Task<ExecutionResult> Execute(ExecuteContext<ShipCoffeeArguments> context)
        {
            await Task.Delay(100);

            return context.Completed<ShipCoffeeLog>(new 
            {
                Value = context.Arguments.Value
            });
        }

        public async Task<CompensationResult> Compensate(CompensateContext<ShipCoffeeLog> context)
        {
            await Task.Delay(100);
            
            return context.Compensated();
        }
    }
}