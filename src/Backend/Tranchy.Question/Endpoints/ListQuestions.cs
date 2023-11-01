using Microsoft.AspNetCore.Builder;
using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints;

public class ListQuestions : IEndpoint
{
    public static async Task<Ok<Data.Question[]>> ListPublicQuestions(CancellationToken cancellationToken = default)
    {
        var acceptedStatuses = new[] { QuestionStatus.Accepted };
        var questions = await DB.Find<Data.Question>().Match(q => acceptedStatuses.Contains(q.Status)).ExecuteAsync(cancellationToken);

        return TypedResults.Ok(questions.ToArray());
    }

    public static async Task<Ok<Data.Question[]>> ListMyQuestions([FromServices] ITenant tenant, CancellationToken cancellationToken = default)
    {
        var questions = await DB.Find<Data.Question>().Mine(tenant).ExecuteAsync(cancellationToken);

        return TypedResults.Ok(questions.ToArray());
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/list/public", ListPublicQuestions).WithName("ListPublicQuestions");
        routeGroupBuilder.MapGet("/list/mine", ListPublicQuestions).WithName("ListMyQuestions");
    }
}
