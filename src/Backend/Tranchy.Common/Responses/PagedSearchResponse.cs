namespace Tranchy.Common.Responses;

public class PagedSearchResponse<T>
{
    public required IEnumerable<T> Data { get; set; }
    public required long TotalCount { get; set; }
    public required int PageCount { get; set; }
}
