using Tranchy.Common.Constants;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints.Mobile;

public class GetQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/{questionId}", Handler)
        .WithName("GetQuestion")
        .WithSummary("Get question detail")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<Data.Question>, BadRequest>> Handler(
        [FromRoute] string questionId,
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var question = await DB.Find<Data.Question>().MatchID(questionId).ExecuteSingleAsync(cancellation);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.RefinePermissions(tenant.Email);

        return TypedResults.Ok(question);
    }
}
