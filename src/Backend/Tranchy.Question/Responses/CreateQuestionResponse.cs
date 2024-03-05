using System.ComponentModel.DataAnnotations;

namespace Tranchy.Question.Responses;

public record CreateQuestionResponse
{
    [Required] public required string Id { get; init; }
}
