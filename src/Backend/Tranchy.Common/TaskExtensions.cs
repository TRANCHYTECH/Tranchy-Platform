namespace Tranchy.Common;

public static class TaskExtensions
{
    public static void Forget(this Task task)
    {
        if (!task.IsCompleted || task.IsFaulted)
        {
            _ = ForgetAwaited(task);
        }
    }
#pragma warning disable RCS1090
    private static async Task ForgetAwaited(Task task) => await task.ConfigureAwait(ConfigureAwaitOptions.SuppressThrowing);
#pragma warning restore RCS1090
}
