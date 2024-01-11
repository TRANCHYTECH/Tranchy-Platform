using Tranchy.Common.Services;

namespace Tranchy.User.Queries;

internal static class UserQueries
{
    public static Task<Data.User?> GetMyProfileAsync(
        ITenant tenant,
        CancellationToken cancellationToken
    ) =>
        DB.Find<Data.User>()
            .Match(e => e.ID == tenant.UserId)
            .ExecuteSingleAsync(cancellationToken);
}
