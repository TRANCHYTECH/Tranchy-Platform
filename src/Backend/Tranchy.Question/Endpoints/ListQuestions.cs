using MongoDB.Entities;
using Tranchy.Common.Responses;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints;

public class ListQuestions : IEndpoint
{
    public static async Task<Ok<Data.Question[]>> ListCommunityQuestions([FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var acceptedStatuses = new[] { QuestionStatus.Accepted, QuestionStatus.InProgress, QuestionStatus.Resolved };
        var questions = await DB.Find<Data.Question>()
            .Match(q => acceptedStatuses.Contains(q.Status))
            .Sort(q => q.CreatedOn, Order.Descending)
            .ExecuteAsync(cancellation);
        questions.ForEach(q => q.RefinePermissions(tenant.UserId));

        return TypedResults.Ok(questions.ToArray());
    }

    public static async Task<Ok<Data.Question[]>> ListMyQuestions([FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var questions = await DB.Find<Data.Question>().Mine(tenant).ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.ToArray());
    }

    public static async Task<Ok<PagedSearchResponse<QuestionBrief>>> RecentQuestions([FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        // todo: how to solve when if getting latest, then question status changed, lead to wrong condition.
        // var questions = await DB.Find<Data.Question>()
        //     .Other(tenant)
        //     .Sort(q => q.CreatedOn, Order.Descending)
        //     .Limit(10)
        //     .ExecuteAsync(cancellation);

        return TypedResults.Ok(new PagedSearchResponse<QuestionBrief>
        {
            Data = Array.Empty<QuestionBrief>(),
            PageCount = 1,
            TotalCount = 1
        });
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/list/community", ListCommunityQuestions)
            .WithName("ListCommunityQuestions")
            .WithSummary("List community questions")
            .WithTags("Questions")
            .WithOpenApi();
        routeGroupBuilder.MapGet("/list/mine", ListMyQuestions)
            .WithName("ListMyQuestions")
            .WithSummary("List my questions")
            .WithTags("Questions")
            .WithOpenApi();
        routeGroupBuilder.MapGet("/list/recent", ListMyQuestions)
            .WithName("GetRecentQuestions")
            .WithSummary("Get recent questions")
            .WithTags("Questions")
            .WithOpenApi();
    }
}
