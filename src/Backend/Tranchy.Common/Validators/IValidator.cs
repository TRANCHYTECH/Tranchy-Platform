namespace Tranchy.Common.Validators
{
    public interface IValidator<T>
    {
        Task<bool> IsValidAsync(T model, out IDictionary<string, string[]> errors);
    }
}
