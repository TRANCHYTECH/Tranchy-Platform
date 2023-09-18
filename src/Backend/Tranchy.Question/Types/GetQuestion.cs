using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Tranchy.Common;
using HotChocolate.Types;

namespace Tranchy.Question.Types;

public record QuestionOutput(string Title);

[ExtendObjectType("Query")]
public class QuestionQueryExtension
{
    public static QuestionOutput ById(string id)
    {
        return new("Question id " + id);
    }
}

