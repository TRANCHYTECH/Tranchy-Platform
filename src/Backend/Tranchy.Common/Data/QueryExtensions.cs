using Tranchy.Common.Data;
using Tranchy.Common.Services;

namespace MongoDB.Entities;

public static class QueryExtensions
{
    public static Find<T, TProjection> Mine<T, TProjection>(this Find<T, TProjection> find, ITenant tenant) where T : class, IOwnEntity => find.Match(e => e.CreatedByUserId == tenant.UserId);
    public static Find<T, TProjection> Other<T, TProjection>(this Find<T, TProjection> find, ITenant tenant) where T : class, IOwnEntity => find.Match(e => e.CreatedByUserId != tenant.UserId);
    public static Find<T, TProjection> Other<T, TProjection>(this Find<T, TProjection> find, string id, ITenant tenant) where T : class, IOwnEntity => find.Match(e => e.ID == id && e.CreatedByUserId != tenant.UserId);
}
