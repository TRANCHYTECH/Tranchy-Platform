namespace Tranchy.Common;

public interface ICommand
{
    abstract static string Queue { get; }
}