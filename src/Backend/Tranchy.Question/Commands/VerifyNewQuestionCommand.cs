namespace Tranchy.Question.Commands;

public class VerifyNewQuestionCommand : ICommand
{
    public required string Id { get; init; }
}
