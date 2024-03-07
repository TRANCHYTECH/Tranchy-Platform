using MongoDB.Bson;
using MongoDB.Driver;
using Tranchy.Common.Constants;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.Mobile;

public class GetUserHighlights : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/aggregates/user-highlights", GetHighlights)
        .WithName("GetUserHighlights")
        .WithSummary("Get highlights for user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<GetUserHighlightsResponse>> GetHighlights(
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        var aggregateOptions = new AggregateOptions { Let = new BsonDocument("user", tenant.Email) };

        var matchedProfileQuery = QuestionQueryBuilder.Parse(new QueryQuestionsRequest
        {
            Other = true,
            SupportLevel = SupportLevel.Expert,
            Categories = ["law", "string"], // todo: get user categories
            Status = QuestionStatus.Accepted,
            CreatedAtSortingType = SortingType.Ascending,
            Limit = 5,
            ProjectQuestionBrief = true
        });

        var matchedProfileQuestions = await DB.Collection<Data.Question>().Aggregate<QuestionBrief>(matchedProfileQuery,
            aggregateOptions, cancellation).ToListAsync(cancellation);

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
            aggregateOptions, cancellation).ToListAsync(cancellation);

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
            aggregateOptions, cancellation).ToListAsync(cancellation);

        var categorySummaryQuery = new BsonDocument[]
        {
            new("$unwind",
                new BsonDocument { { "path", "$QuestionCategoryIds" }, { "preserveNullAndEmptyArrays", false } }),
            new("$group",
                new BsonDocument
                {
                    { "_id", "$QuestionCategoryIds" }, { "TotalQuestions", new BsonDocument("$sum", 1) }
                }),
            new("$sort",
                new BsonDocument("TotalQuestions", -1)),
            new("$limit", 5)
        };

        var categorySummary = await DB.Collection<Data.Question>().Aggregate<CategoryBrief>(categorySummaryQuery,
            aggregateOptions, cancellation).ToListAsync(cancellation);

        GetUserHighlightsResponse response = new()
        {
            ExpertExclusive = { Data = topPrioritiesQuestions },
            Recent = { Data = recentQuestions },
            MatchProfile = { Data = matchedProfileQuestions },
            PopularCategories = { Data = categorySummary }
        };

        return TypedResults.Ok(response);
    }
}
