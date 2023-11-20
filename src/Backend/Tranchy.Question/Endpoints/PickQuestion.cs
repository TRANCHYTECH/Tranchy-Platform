using MongoDB.Entities;
using Tranchy.Common.Services;

namespace Tranchy.Question.Endpoints;

public class PickQuestion : IEndpoint
{
    public static async Task<Results<NoContent, BadRequest>> Pick([FromRoute] string id, [FromServices] ITenant tenant, CancellationToken cancellation)
    {
        var question = await DB.Find<Data.Question>().Other(id, tenant).ExecuteSingleAsync(cancellation);
        if (question is null)
        {
            return TypedResults.BadRequest();
        }

        question.Pick(tenant.UserId);
        await DB.SaveAsync(question, cancellation: cancellation);

        return TypedResults.NoContent();
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/{id}/pick", Pick).WithName("PickQuestion");
    }
}

