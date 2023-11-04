namespace Tranchy.Common.Exceptions;

public class TranchyAteChillyException : Exception
{
    public TranchyAteChillyException()
    {
    }

    public TranchyAteChillyException(string? message) : base(message)
    {
    }

    public TranchyAteChillyException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
