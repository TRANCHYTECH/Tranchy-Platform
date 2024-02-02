using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;
using Tranchy.Common.Data;
using Tranchy.Question.Data;

namespace Tranchy.Question.Responses;

[SwaggerSchema(Required = ["expertExclusive", "recent", "popularCategories", "matchProfile"])]
public record GetUserHighlightsResponse
{
    public Section<QuestionBrief> ExpertExclusive { get; } = new();

    public Section<QuestionBrief> Recent { get; } = new();

    public Section<CategoryBrief> PopularCategories { get; } = new();

    public Section<QuestionBrief> MatchProfile { get; } = new();
}

public class QuestionBrief : IQueryIndex
{
    [Required] public required string ID { get; set; }

    [Required] public required string Title { get; set; }

    [Required] public required IEnumerable<string> Categories { get; set; }

    [Required] public string? Price { get; set; }

    [Required] public DateTime CreatedOn { get; set; }

    [Required] public required string CreatedBy { get; set; }

    [JsonIgnore] public long QueryIndex { get; init; }
}

public class CategoryBrief
{
    [Required]
    public required string Id { get; init; }

    public required int TotalQuestions { get; init; }
}

[SwaggerSchema(Required = ["data"])]
public record Section<T> where T : class
{
    [SwaggerSchema(Nullable = false)] public ICollection<T> Data { get; set; } = new List<T>();
}

public class HighlightAggregate
{
    public required ICollection<TopQuestionsBySupportLevel> TopQuestionsBySupportLevels { get; set; }

    public required ICollection<CategoryBrief> TopCategories { get; set; }
}

public class TopQuestionsBySupportLevel
{
    [Field("_id")]
    public SupportLevel Id { get; set; }

    public required ICollection<QuestionBrief> Questions { get; set; }
}
