using Tranchy.Question.Integrations.Endpoints;

namespace Tranchy.Question.Validators
{
    internal class CreateQuestionValidator : Validator<CreateQuestion>
    {
        public CreateQuestionValidator(IServiceProvider serviceProvider): base(serviceProvider)
        {
        }

        protected override Task<bool> CustomValidateAsync(CreateQuestion model)
        {
            // TODO: validate category ids
            return Task.FromResult(true);
        }
    }
}
