using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Tranchy.Common;

namespace Tranchy.Question
{
    public class QuestionModule : IModule
    {
        public string VerifyQuestionQueue { get; init; } = default!;

        public void 1A(IServiceCollection builder)
        {
            builder.AddGraphQL().AddQuestionTypes();
        }
    }
}
