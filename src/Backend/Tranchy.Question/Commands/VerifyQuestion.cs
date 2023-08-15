using Tranchy.Common;

namespace Tranchy.Question.Commands
{
    public class VerifyQuestion: ICommand
    {
        public static string Queue => "tranchy-question-commands-verify-question";

        public string Title { get; set; } = default!;
    }
}
