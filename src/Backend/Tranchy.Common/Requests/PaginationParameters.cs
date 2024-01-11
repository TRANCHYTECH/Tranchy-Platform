using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Tranchy.Common.Requests;

public class PaginationParameters
{
    public long? QueryIndex { get;set; }

    [Range(1, 100)]
    [DefaultValue(10)]
    public int PageSize { get; set; }

    public int GetQueryPageSize() => PageSize + 1;
}
