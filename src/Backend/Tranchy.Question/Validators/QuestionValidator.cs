namespace Tranchy.Question.Validators;

public class QuestionValidator : AbstractValidator<Data.Question>
{
    public QuestionValidator()
    {
        RuleFor(q => q.Title).NotEmpty().MinimumLength(10).MaximumLength(1000);
        RuleFor(q => q.SupportLevel).IsInEnum();
        RuleFor(q => q.Status).IsInEnum();
        RuleFor(q => q.QuestionCategoryIds).NotEmpty();
        RuleFor(q => q.CreatedBy).NotEmpty().EmailAddress();
    }
}
