using System.ComponentModel.DataAnnotations;
using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints;

public class ListQuestions : IEndpoint
{
    public static async Task<Ok<Data.Question[]>> GetCommunityQuestions(
        [FromServices] ITenant tenant,
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

    public static async Task<Ok<Data.Question[]>> GetMyQuestions(
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var questions = await DB.Find<Data.Question>().Mine(tenant).ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.ToArray());
    }

    public static async Task<Ok<ICollection<QuestionBrief>>> GetRecentQuestions(
        [FromServices] ITenant tenant,
        [FromQuery] long? lastQueryIndex,
        [FromQuery][Range(1, 100)] int pageSize = 10,
        CancellationToken cancellation = default)
    {
        var allowedStatuses = new[] { QuestionStatus.Accepted };

        var questionsQuery = DB.Find<Data.Question, QuestionBrief>()
           .Match(q => allowedStatuses.Contains(q.Status))
           .Other(tenant);

        // Order by latest created on, so the usage of query index should be the same as Sort condition
        if (lastQueryIndex is not null)
        {
            questionsQuery = questionsQuery.Match(q => q.QueryIndex < lastQueryIndex);
        }

        ICollection<QuestionBrief> questions = await questionsQuery
            .Sort(q => q.CreatedOn, Order.Descending)
            .Project(q => new QuestionBrief
            {
                ID = q.ID,
                Title = q.Title,
                Categories = q.QuestionCategoryIds,
                CreatedOn = q.CreatedOn,
                Saved = false,
                Price = "vnd 500",
                CreatedBy = q.CreatedByUserId,
                QueryIndex = q.QueryIndex
            })
            .Limit(pageSize)
            .ExecuteAsync(cancellation);

        return TypedResults.Ok(questions);
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/sections/community", GetCommunityQuestions)
            .WithName("ListCommunityQuestions")
            .WithSummary("List community questions")
            .WithTags("Questions")
            .WithOpenApi();
        routeGroupBuilder.MapGet("/sections/mine", GetMyQuestions)
            .WithName("ListMyQuestions")
            .WithSummary("List my questions")
            .WithTags("Questions")
            .WithOpenApi();
        routeGroupBuilder.MapGet("/sections/recent", GetRecentQuestions)
            .WithName("GetRecentQuestions")
            .WithSummary("Get recent questions")
            .WithTags("Questions")
            .WithOpenApi();
    }
}
