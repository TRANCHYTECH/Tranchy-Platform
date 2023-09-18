using Microsoft.Extensions.DependencyInjection;
using Tranchy.Common;

namespace Tranchy.Question
{
    public class QuestionModule : IModule
    {
        public static void Register(IServiceCollection services)
        {
            services.AddGraphQL().AddQuestionTypes();
        }
    }
}
