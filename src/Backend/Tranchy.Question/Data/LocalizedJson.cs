namespace Tranchy.Question.Data;

public record LocalizedItem(string Language, string Text);

public class LocalizedJson : Dictionary<string, string>
{
}
