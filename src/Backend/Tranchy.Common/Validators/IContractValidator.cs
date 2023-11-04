namespace Tranchy.Common.Validators;

public interface IContractValidator<T>
{
    Task<bool> IsValidAsync(T model, out IDictionary<string, string[]> errors);
}
