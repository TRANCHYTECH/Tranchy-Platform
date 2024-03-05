using FluentValidation;
using FluentValidation.Results;
using Tranchy.Common.Exceptions;

namespace Tranchy.Common.Validators;

public static class FluentValidationExtensions
{
    public static async Task TryValidate<T>(this IValidator<T> validator, T instance,
        CancellationToken cancellation = default)
    {
        var result = await validator.ValidateAsync(instance, cancellation);
        CheckResultThrowException(result);
    }

    public static async Task TryValidate<T>(this IValidator<T> validator, T instance, CancellationToken cancellation,
        params string[] properties)
    {
        var result = await validator.ValidateAsync(instance, opt => opt.IncludeProperties(properties), cancellation);
        CheckResultThrowException(result);
    }

    private static void CheckResultThrowException(ValidationResult result)
    {
        if (result.IsValid)
        {
            return;
        }

        var ex = new ValidationException(result.Errors);
        throw new TranchyAteChillyException(ex.Message, ex);
    }

    public static void AddFailureWithErrorCode<T>(this ValidationContext<T> context, string errorCode) =>
        context.AddFailure(new ValidationFailure { PropertyName = context.PropertyPath, ErrorCode = errorCode });
}
