using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using Swashbuckle.AspNetCore.Annotations;

namespace Tranchy.Question.Responses;

[SwaggerSchema(Required = ["expertExclusive", "recent", "popularCategories", "matchProfile"])]
public record GetUserHighlightsResponse
{
    public Section<QuestionBrief> ExpertExclusive { get; } = new();

    public Section<QuestionBrief> Recent { get; } = new();

    public Section<CategoryBrief> PopularCategories { get; } = new();

    public Section<QuestionBrief> MatchProfile { get; } = new();
}

[method: SetsRequiredMembers]
public record QuestionBrief()
{
    [Required]
    public required string Title { get; set; }

    [Required]
    public required IEnumerable<string> Categories { get; set; }

    [Required]
    public string? Price { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public required string CreatedBy { get; set; }

    [Required]
    public bool Saved { get; set; }
}

public class CategoryBrief
{
    public required string Title { get; set; }
}

[SwaggerSchema(Required = ["data"])]
public record Section<T> where T : class
{
    [SwaggerSchema(Nullable = false)]
    public ICollection<T> Data { get; } = new List<T>();
}
