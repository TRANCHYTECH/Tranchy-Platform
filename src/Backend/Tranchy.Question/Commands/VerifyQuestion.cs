using Tranchy.Common;

namespace Tranchy.Question.Commands
{
    public class VerifyQuestion : ICommand
    {
        public string Title { get; set; } = default!;
    }
}
