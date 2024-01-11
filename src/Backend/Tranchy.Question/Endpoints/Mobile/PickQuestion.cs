using Tranchy.Common.Constants;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints.Mobile;

public class PickQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{questionId}:pick", Pick)
        .WithName("PickQuestion")
        .WithSummary("Take consultation")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<Data.Question>, BadRequest>> Pick(
        [FromRoute] string questionId,
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var question = await DB.Find<Data.Question>().Other(questionId, tenant).ExecuteSingleAsync(cancellation);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.TakeConsultation(tenant.UserId);
        await DB.SaveAsync(question, cancellation: cancellation);
        question.RefinePermissions(tenant.UserId);

        return TypedResults.Ok(question);
    }
}
