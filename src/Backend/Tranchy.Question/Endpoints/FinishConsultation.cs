using MongoDB.Entities;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints;

public class FinishConsultation : IEndpoint
{
    /// <summary>
    /// Finish consultation
    /// </summary>
    /// <param name="id"></param>
    /// <param name="request"></param>
    /// <param name="tenant"></param>
    /// <param name="cancellation"></param>
    /// <returns></returns>
    public static async Task<Results<Ok, BadRequest>> Finish(
        [FromRoute] string id,
        [FromBody] FinishConsultationRequest request,
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var question = await DB.Find<Data.Question>().Match(q => q.ID == id && q.Consultant != null && q.Consultant.UserId == tenant.UserId).ExecuteSingleAsync(cancellation);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.FinishConsultation(tenant.UserId, request.Conclusion);
        await DB.SaveAsync(question, cancellation: cancellation);

        return TypedResults.Ok();
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/{id}/finish", Finish)
        .WithName("FinishConsultation")
        .WithTags("Question Action")
        .WithSummary("Finish consultation")
        .WithOpenApi();
}
