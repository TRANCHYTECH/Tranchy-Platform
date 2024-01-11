using System.Text.Json.Serialization;

namespace Tranchy.Common.Responses;

public class PaginationResponse<T>
{
    public IEnumerable<T> Data { get; set; } = new List<T>();

    [JsonNumberHandling(JsonNumberHandling.WriteAsString)]
    public long? NextQueryIndex { get; set; }
}
