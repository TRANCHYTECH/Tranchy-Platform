using MiniValidation;
using Tranchy.Common.Validators;

namespace Tranchy.Common;

public class Validator<T> : IContractValidator<T>
{
    private readonly IServiceProvider _serviceProvider;

    public Validator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public virtual Task<bool> IsValidAsync(T model, out IDictionary<string, string[]> errors)
    {
        bool isValid = MiniValidator.TryValidate(model, _serviceProvider, out errors);

        if (isValid)
        {
            return CustomValidateAsync(model);
        }

        return Task.FromResult(false);
    }

    protected virtual Task<bool> CustomValidateAsync(T model)
    {
        return Task.FromResult(true);
    }
}
