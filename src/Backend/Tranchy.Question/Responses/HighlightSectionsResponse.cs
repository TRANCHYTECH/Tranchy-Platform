using System.Diagnostics.CodeAnalysis;

namespace Tranchy.Question.Responses;

public record HighlightSectionsResponse
{
    public Section<QuestionBrief> ExpertExclusive { get; set; } = new();

    public Section<QuestionBrief> Recent { get; set; } = new();

    public Section<CategoryBrief> PopularCategories { get; init; } = new();

    public Section<QuestionBrief> MatchProfile { get; init; } = new();
}

[method: SetsRequiredMembers]
public record QuestionBrief()
{
    public required string Title { get; set; }
    public required IEnumerable<string> Categories { get; set; }
    public string? Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Saved { get; set; }
}

public class CategoryBrief
{
    public required string Title { get; set; }
}

public record Section<T> where T : class
{
    public ICollection<T> Data { get; } = new List<T>();
}
