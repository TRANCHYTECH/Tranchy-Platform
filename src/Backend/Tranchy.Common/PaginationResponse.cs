using System.Text.Json.Serialization;

namespace Tranchy.Common;

public class PaginationResponse<T>
{
    public IEnumerable<T> Data { get; set; } = new List<T>();

    [JsonNumberHandling(JsonNumberHandling.WriteAsString)]
    public long? NextQueryIndex { get; set; }
}
