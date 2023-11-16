using Tranchy.Common.Constants;

namespace Tranchy.Question.Data;

public class LocalizedString : Dictionary<string, string>
{
    public LocalizedString ForVietnam(string value)
    {
        this[Languages.Vietnam] = value;
        return this;
    }

    public LocalizedString ForEnglish(string value)
    {
        this[Languages.English] = value;
        return this;
    }

    public static LocalizedString Create(string vn, string en) => new LocalizedString().ForVietnam(vn).ForEnglish(en);
}