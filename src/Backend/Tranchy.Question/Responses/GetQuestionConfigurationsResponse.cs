using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;
using Tranchy.Question.Data;

namespace Tranchy.Question.Responses;

[SwaggerSchema(Required = ["questionCategories", "questionPriorities", "userId", "email"])]
public class GetQuestionConfigurationsResponse
{
    [SwaggerSchema(Nullable = false)]
    public required IEnumerable<QuestionCategoryResponse> QuestionCategories { get; init; }

    [SwaggerSchema(Nullable = false)]
    public required IEnumerable<QuestionPriorityResponse> QuestionPriorities { get; init; }

    [SwaggerSchema(Nullable = false)] public required string UserId { get; set; }

    [SwaggerSchema(Nullable = false)] public required string Email { get; set; }
}

public class QuestionCategoryResponse
{
    [Required] public required string Key { get; set; }

    [Required] public required LocalizedString Title { get; set; }

    [Required] public required LocalizedString Description { get; set; }
}

public class QuestionPriorityResponse
{
    [Required] public required string Key { get; set; }

    [Required] public required LocalizedString Title { get; set; }

    [Required] public required LocalizedString Description { get; set; }

    [Required] public int Rank { get; set; }

    [Required] public required IDictionary<string, object> PriorityMetaData { get; set; }

    [Required] public TimeSpan Duration { get; set; }
}
