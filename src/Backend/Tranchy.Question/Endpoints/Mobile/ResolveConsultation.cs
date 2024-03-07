using Tranchy.Common.Constants;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints.Mobile;

public class ResolveConsultation : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{questionId}:resolve", Finish)
        .WithName("ResolveConsultation")
        .WithTags(Tags.Mobile)
        .WithSummary("Resolve consultation")
        .WithOpenApi();

    private static async Task<Results<Ok, BadRequest>> Finish(
        [FromRoute] string questionId,
        [FromBody] FinishConsultationRequest request,
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var question = await DB.Find<Data.Question>()
            .Match(q => q.ID == questionId && q.Consultant != null && q.Consultant.User == tenant.Email)
            .ExecuteSingleAsync(cancellation);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.FinishConsultation(tenant.Email, request.Conclusion);
        await DB.SaveAsync(question, cancellation: cancellation);

        return TypedResults.Ok();
    }
}
