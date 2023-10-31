using Microsoft.AspNetCore.Builder;
using MongoDB.Entities;

namespace Tranchy.Question.Endpoints;

public class VerifyQuestion : IEndpoint
{
    public static async Task<IResult> Accept([FromRoute] string id)
    {
        var question = await DB.Find<Data.Question>().MatchID(id).ExecuteSingleAsync();
        if (question == null)
        {
            return TypedResults.BadRequest();
        }

        question.Status = Data.QuestionStatus.Accepted;
        await DB.SaveAsync(question);

        return TypedResults.Ok();
    }

    public static Ok<QuestionOutput> ByUser([FromRoute] string user)
    {
        return TypedResults.Ok<QuestionOutput>(new("Question id " + user));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/{id}/accept", Accept).WithName("AcceptQuestion");
    }
}

