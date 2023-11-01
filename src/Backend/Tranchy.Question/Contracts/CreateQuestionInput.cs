using Tranchy.Question.Data;
using System.ComponentModel.DataAnnotations;

namespace Tranchy.Question.Contracts;

public record CreateQuestionInput(
    [Required][MinLength(10)]
    string Title,
    SupportLevel SupportLevel,
    string[] QuestionCategoryIds
);
