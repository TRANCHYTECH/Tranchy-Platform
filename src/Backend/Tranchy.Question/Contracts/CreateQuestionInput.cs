using Tranchy.Question.Data;
using System.ComponentModel.DataAnnotations;

namespace Tranchy.Question.Contracts;

public record CreateQuestionInput(
    [Required][MinLength(10)]
string Title,
    [Required][MinLength(10)]
string Description,
    SupportLevel SupportLevel,
    string[] QuestionCategoryIds
);
