using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Tranchy.Common;

public class PaginationParameters
{
    public long? QueryIndex { get; set; }

    [Range(1, 100)][DefaultValue(10)] public int Limit { get; set; }

    public int GetQueryPageSize() => Limit + 1;
}
