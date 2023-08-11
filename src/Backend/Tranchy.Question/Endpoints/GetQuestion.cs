using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Tranchy.Common;

namespace Tranchy.Question.Endpoints;

public record QuestionOutput(string Title);

public class GetQuestion : IEndpoint
{
    public static Ok<QuestionOutput> ById([FromRoute] string id)
    {
        return TypedResults.Ok<QuestionOutput>(new("Question id " + id));
    }

    public static Ok<QuestionOutput> ByUser([FromRoute] string user)
    {
        return TypedResults.Ok<QuestionOutput>(new("Question id " + user));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/{id}", ById);
        routeGroupBuilder.MapGet("/user/{user}", ByUser);
    }
}

