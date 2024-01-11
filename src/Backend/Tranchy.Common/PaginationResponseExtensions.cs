using Tranchy.Common.Data;

namespace Tranchy.Common;

public static class PaginationResponseExtensions
{
    public static PaginationResponse<T> CreatePaginationResponse<T>(this ICollection<T> data, PaginationParameters paginationParameters)
        where T : IQueryIndex
    {
        var response = new PaginationResponse<T>();
        if (data.Count > paginationParameters.PageSize)
        {
            response.Data = data.SkipLast(1);
            response.NextQueryIndex = data.Last().QueryIndex;
        }
        else
        {
            response.Data = data;
        }

        return response;
    }
}
