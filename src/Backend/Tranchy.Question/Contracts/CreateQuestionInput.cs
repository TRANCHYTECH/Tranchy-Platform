using Tranchy.Question.Data;
using System.ComponentModel.DataAnnotations;

namespace Tranchy.Question.Contracts;

public record CreateQuestionInput(
    [Required][MinLength(10)]
    string Title,
    [Required]
    SupportLevel SupportLevel,
    [Required]
    string PriorityId,
    [Required]
    string[] QuestionCategoryIds
);
