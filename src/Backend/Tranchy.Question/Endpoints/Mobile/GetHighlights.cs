using MongoDB.Bson;
using MongoDB.Driver;
using Tranchy.Common.Constants;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.Mobile;

public class GetHighlights : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/aggregates/user-highlights", GetHighlightsHandler)
        .WithName("GetUserHighlights")
        .WithSummary("Get highlights for user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<GetUserHighlightsResponse>> GetHighlightsHandler(
        [FromServices] ITenant tenant,
        [FromBody] GetHighlightsRequest request,
        CancellationToken cancellation)
    {
        var matchedProfileQuery = QuestionQueryBuilder.Parse(new QueryQuestionsRequest
        {
            Other = true,
            SupportLevel = SupportLevel.Expert,
            // In case there is no category provided, set a random to ensure matching expression return no value as expected.
            Categories = request.Categories.Length > 0 ? request.Categories : [Guid.NewGuid().ToString()],
            Status = QuestionStatus.Accepted,
            CreatedAtSortingType = SortingType.Ascending,
            Limit = 5,
            ProjectQuestionBrief = true
        });

        var matchedProfileQuestions = await DB.Collection<Data.Question>().Aggregate<QuestionBrief>(matchedProfileQuery,
            tenant.DefaultAggregateOptions(), cancellation).ToListAsync(cancellation);

        var opportunitiesQuery = QuestionQueryBuilder.Parse(new QueryQuestionsRequest
        {
            Other = true,
            SupportLevel = SupportLevel.Expert,
            Status = QuestionStatus.Accepted,
            PrioritySorting = SortingType.Descending,
            CreatedAtSortingType = SortingType.Ascending,
            ExceptIds = matchedProfileQuestions.Select(c => c.ID),
            Limit = 5,
            ProjectQuestionBrief = true
        });

        var topPrioritiesQuestions = await DB.Collection<Data.Question>().Aggregate<QuestionBrief>(opportunitiesQuery,
            tenant.DefaultAggregateOptions(), cancellation).ToListAsync(cancellation);

        var recentQuestionsQuery = QuestionQueryBuilder.Parse(new QueryQuestionsRequest
        {
            Other = true,
            SupportLevel = SupportLevel.Expert,
            Status = QuestionStatus.Accepted,
            CreatedAtSortingType = SortingType.Ascending,
            ExceptIds = matchedProfileQuestions.Select(c => c.ID).Concat(topPrioritiesQuestions.Select(c => c.ID)),
            Limit = 5
        });

        var recentQuestions = await DB.Collection<Data.Question>().Aggregate<QuestionBrief>(recentQuestionsQuery,
            tenant.DefaultAggregateOptions(), cancellation).ToListAsync(cancellation);

        var categorySummary = await GetCategorySummary(tenant, cancellation);

        GetUserHighlightsResponse response = new()
        {
            ExpertExclusive = { Data = topPrioritiesQuestions },
            Recent = { Data = recentQuestions },
            MatchProfile = { Data = matchedProfileQuestions },
            PopularCategories = { Data = categorySummary }
        };

        return TypedResults.Ok(response);
    }

    private static async Task<List<CategoryBrief>> GetCategorySummary(ITenant tenant, CancellationToken cancellation)
    {
        var categorySummaryQuery = new BsonDocument[]
        {
            new("$unwind",
                new BsonDocument { { "path", "$CategoryIds" }, { "preserveNullAndEmptyArrays", false } }),
            new("$group",
                new BsonDocument
                {
                    { "_id", "$CategoryIds" }, { "TotalQuestions", new BsonDocument("$sum", 1) },
                }),
            new("$sort",
                new BsonDocument("TotalQuestions", -1)),
            new("$limit", 3),
        };

        var categorySummary = await DB.Collection<Data.Question>().Aggregate<CategoryBrief>(categorySummaryQuery,
            tenant.DefaultAggregateOptions(), cancellation).ToListAsync(cancellation);
        return categorySummary;
    }
}
