using MongoDB.Bson;
using MongoDB.Driver;
using Tranchy.Common.Constants;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.Mobile;

public class ListQuestions : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("/sections/community", GetCommunityQuestions)
            .WithName("GetCommunityQuestions")
            .WithSummary("Get community questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();

        routeGroupBuilder.MapGet("/sections/mine", GetMyQuestions)
            .WithName("GetMyQuestions")
            .WithSummary("Get my questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();

        routeGroupBuilder.MapGet("/sections/my-consultations", GetMyConsultations)
            .WithName("GetMyConsultations")
            .WithSummary("Get my consultations")
            .WithTags(Tags.Mobile)
            .WithOpenApi();

        routeGroupBuilder.MapGet("/sections/recent", GetRecentQuestions)
            .WithName("GetRecentQuestions")
            .WithSummary("Get recent questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();

        routeGroupBuilder.MapPost("/sections/query", QueryQuestions)
            .WithName("QueryQuestions")
            .WithSummary("Query questions")
            .WithTags(Tags.Mobile)
            .WithOpenApi();
    }

    private static async Task<Ok<PaginationResponse<QuestionBrief>>> QueryQuestions(
        [FromServices] ITenant tenant,
        [FromBody] QueryQuestionsRequest queryParameters,
        CancellationToken cancellation)
    {
        queryParameters.ProjectQuestionBrief = true;
        var query = QuestionQueryBuilder.Parse(queryParameters);
        var aggregateOptions = new AggregateOptions { Let = new BsonDocument("user", tenant.Email) };
        var questions = await DB.Collection<Data.Question>().Aggregate<QuestionBrief>(query, aggregateOptions, cancellation).ToListAsync(cancellation);

        return TypedResults.Ok(questions.CreatePaginationResponse(queryParameters));
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
        questions.ForEach(q => q.RefinePermissions(tenant.Email));

        return TypedResults.Ok(questions.ToArray());
    }

    private static async Task<Ok<PaginationResponse<QuestionBrief>>> GetMyQuestions(
        [FromServices] ITenant tenant,
        [AsParameters] PaginationParameters paginationParameters,
        CancellationToken cancellation = default)
    {
        var questionsQuery = DB.Find<Data.Question, QuestionBrief>()
            .Mine(tenant);

        return await CreatePaginationResponse(questionsQuery, paginationParameters, cancellation);
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

        return await CreatePaginationResponse(questionsQuery, paginationParameters, cancellation);
    }

    private static async Task<Ok<PaginationResponse<QuestionBrief>>> GetMyConsultations(
        [FromServices] ITenant tenant,
        [AsParameters] PaginationParameters paginationParameters,
        CancellationToken cancellation = default)
    {
        var allowedStatuses = new[] { QuestionStatus.InProgress };

        var questionsQuery = DB.Find<Data.Question, QuestionBrief>()
            .Match(q => allowedStatuses.Contains(q.Status) && q.Consultant != null &&
                        q.Consultant.User == tenant.Email);

        // Order by latest created on, so the usage of query index should be the same as Sort condition
        if (paginationParameters.QueryIndex is not null)
        {
            questionsQuery = questionsQuery.Match(q => q.QueryIndex <= paginationParameters.QueryIndex);
        }

        return await CreatePaginationResponse(questionsQuery, paginationParameters, cancellation);
    }

    private static async Task<Ok<PaginationResponse<QuestionBrief>>> CreatePaginationResponse(
        Find<Data.Question, QuestionBrief> questionsQuery,
        PaginationParameters paginationParameters,
        CancellationToken cancellation)
    {
        ICollection<QuestionBrief> questions = await questionsQuery
            .Sort(q => q.CreatedOn, Order.Descending)
            .Project(q => new QuestionBrief
            {
                ID = q.ID,
                Title = q.Title,
                Categories = q.QuestionCategoryIds,
                CreatedOn = q.CreatedOn,
                Price = "todo",
                CreatedBy = q.CreatedBy,
                QueryIndex = q.QueryIndex
            })
            .Limit(paginationParameters.GetQueryPageSize())
            .ExecuteAsync(cancellation);

        return TypedResults.Ok(questions.CreatePaginationResponse(paginationParameters));
    }
}
