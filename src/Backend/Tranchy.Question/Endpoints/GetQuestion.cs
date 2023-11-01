using Microsoft.AspNetCore.Builder;

namespace Tranchy.Question.Endpoints;

public record QuestionOutput(string Id);

public class GetQuestion : IEndpoint
{
    public static Results<Ok<QuestionOutput>, NotFound> ById([FromRoute] string id)
    {
        return TypedResults.Ok<QuestionOutput>(new("Question id " + id));
    }

    public static Results<Ok<QuestionOutput>, NotFound> ByUser([FromRoute] string user)
    {
        return TypedResults.Ok<QuestionOutput>(new("Question id " + user));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/{id}", ById).WithName("GetQuestionById");
        routeGroupBuilder.MapGet("/user/{user}", ByUser).WithName("GetQuestionByUser");
    }
}

