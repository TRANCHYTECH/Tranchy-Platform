using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;
using Tranchy.Question.Data;

namespace Tranchy.Question.Responses;

[SwaggerDiscriminator("$type")]

[JsonDerivedType(typeof(MobileQuestionEventMessageSent), nameof(QuestionEventType.MessageSent))]
[SwaggerSubType(typeof(MobileQuestionEventMessageSent), DiscriminatorValue = nameof(QuestionEventType.MessageSent))]
public abstract class MobileQuestionEvent
{
    [JsonPropertyName("_id")]
    public required string ID { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedOn { get; set; }

    public User User { get; set; } = new User();
}

public record User
{
    [JsonPropertyName("_id")]
    public string? Id { get; set; }
}

public class MobileQuestionEventMessageSent : MobileQuestionEvent
{
    [JsonPropertyName("text")]
    public required string Content { get; set; }
}
