using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints;

public class ListQuestions : IEndpoint
{
    public static async Task<Ok<Data.Question[]>> ListCommunityQuestions([FromServices] ITenant tenant, CancellationToken cancellation)
    {
        var acceptedStatuses = new[] { QuestionStatus.Accepted, QuestionStatus.InProgress, QuestionStatus.Resolved };
        var questions = await DB.Find<Data.Question>()
        .Match(q => acceptedStatuses.Contains(q.Status))
        .Sort(q => q.CreatedOn, Order.Descending)
        .ExecuteAsync(cancellation);
        questions.ForEach(q => q.RefinePermissions(tenant.UserId));

        return TypedResults.Ok(questions.ToArray());
    }

    public static async Task<Ok<Data.Question[]>> ListMyQuestions([FromServices] ITenant tenant, CancellationToken cancellation)
    {
        var questions = await DB.Find<Data.Question>().Mine(tenant).ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.ToArray());
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/list/community", ListCommunityQuestions).WithName("ListCommunityQuestions").WithTags("Questions");
        routeGroupBuilder.MapGet("/list/mine", ListMyQuestions).WithName("ListMyQuestions").WithTags("Questions");
    }
}
