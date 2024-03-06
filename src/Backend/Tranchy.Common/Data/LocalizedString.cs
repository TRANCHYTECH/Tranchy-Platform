using Tranchy.Common.Constants;

namespace Tranchy.Common.Data;

public class LocalizedString : Dictionary<string, string>
{
    private LocalizedString ForVietnam(string value)
    {
        this[Languages.Vietnam] = value;
        return this;
    }

    private LocalizedString ForEnglish(string value)
    {
        this[Languages.English] = value;
        return this;
    }

    public static LocalizedString Create(string vn, string en) => new LocalizedString().ForVietnam(vn).ForEnglish(en);
}
