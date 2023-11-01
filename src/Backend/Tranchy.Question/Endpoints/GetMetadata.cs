using Microsoft.AspNetCore.Builder;
using Tranchy.Question.Contracts;

namespace Tranchy.Question.Endpoints;

public class GetMetadata : IEndpoint
{
    public static IResult GetQuestionConfigurations()
    {
        var response = new GetQuestionConfigurations();

        return TypedResults.Ok(response);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/configurations", GetQuestionConfigurations).WithName("GetQuestionConfigurations");
    }
}
