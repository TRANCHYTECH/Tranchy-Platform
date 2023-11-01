using Microsoft.AspNetCore.Builder;
using Tranchy.Question.Contracts;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints;

public class GetMetadata : IEndpoint
{
    public static Ok<GetQuestionConfigurationsResponse> GetQuestionConfigurations()
    {
        var response = new GetQuestionConfigurationsResponse
        {
            QuestionCategories = Array.Empty<QuestionCategory>()
        };

        return TypedResults.Ok(response);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/configurations", GetQuestionConfigurations).WithName("GetQuestionConfigurations");
    }
}
