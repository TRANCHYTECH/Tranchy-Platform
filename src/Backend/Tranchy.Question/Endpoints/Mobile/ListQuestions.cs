using Tranchy.Common.Constants;
using Tranchy.Common.Requests;
using Tranchy.Common.Responses;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.Mobile;

public class ListQuestions : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/sections/community", GetCommunityQuestions)
            .WithName("ListCommunityQuestions")
            .WithSummary("List community questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();

        routeGroupBuilder.MapGet("/sections/mine", GetMyQuestions)
            .WithName("ListMyQuestions")
            .WithSummary("List my questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();

        routeGroupBuilder.MapGet("/sections/recent", GetRecentQuestions)
            .WithName("GetRecentQuestions")
            .WithSummary("Get recent questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();
    }

    private static async Task<Ok<Data.Question[]>> GetCommunityQuestions(
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

    private static async Task<Ok<Data.Question[]>> GetMyQuestions(
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var questions = await DB.Find<Data.Question>().Mine(tenant).ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.ToArray());
    }

    private static async Task<Ok<PaginationResponse<QuestionBrief>>> GetRecentQuestions(
        [FromServices] ITenant tenant,
        [AsParameters] PaginationParameters paginationParameters,
        CancellationToken cancellation = default)
    {
        var allowedStatuses = new[] { QuestionStatus.Accepted };

        var questionsQuery = DB.Find<Data.Question, QuestionBrief>()
            .Match(q => allowedStatuses.Contains(q.Status))
            .Other(tenant);

        // Order by latest created on, so the usage of query index should be the same as Sort condition
        if (paginationParameters.QueryIndex is not null)
        {
            questionsQuery = questionsQuery.Match(q => q.QueryIndex <= paginationParameters.QueryIndex);
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
            .Limit(paginationParameters.GetQueryPageSize())
            .ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.CreatePaginationResponse(paginationParameters));
    }
}
