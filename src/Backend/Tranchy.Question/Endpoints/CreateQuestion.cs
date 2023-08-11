using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Tranchy.Common;

namespace Tranchy.Question.Endpoints;

public record CreateQuestionInput(string Title);

public class CreateQuestion : IEndpoint
{
    public static Ok<QuestionOutput> Create([FromBody] CreateQuestionInput input)
    {
        return TypedResults.Ok<QuestionOutput>(new(input.Title));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/", Create);
    }
}

