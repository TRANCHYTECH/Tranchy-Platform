using System.ComponentModel.DataAnnotations;

namespace Tranchy.Common;

public class PaginationResponse<T>
{
    [Required] public IEnumerable<T> Data { get; set; } = new List<T>();

    public bool HaveNextPage { get; set; }

    public string? NextQueryIndex { get; set; }
}
