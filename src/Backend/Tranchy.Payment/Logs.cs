using Microsoft.Extensions.Logging;

namespace Tranchy.Payment;

public static partial class Logs
{
    [LoggerMessage(EventId = 1, Level = LogLevel.Information, Message = "Charged customer a payment {money}")]
    public static partial void Charged(this ILogger logger, decimal money);

    [LoggerMessage(EventId = 2, Level = LogLevel.Error, Message = "Reverted customer a payment {money}")]
    public static partial void Reverted(this ILogger logger, decimal money);
}
