using MongoDB.Bson;
using Tranchy.Common.Constants;

namespace Tranchy.Question.Endpoints.BackOffice;

public class SummarizeTotalQuestions : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/aggregates/category-summary", CategorySummaryFunction)
        .WithName("SummarizeTotalQuestions")
        .WithSummary("Summarize total questions of categories")
        .WithTags(Tags.BackOffice)
        .WithOpenApi();

    private static async Task<Ok> CategorySummaryFunction(CancellationToken cancellationToken)
    {
        var pipeline = new[]
        {
            new BsonDocument("$unwind",
                new BsonDocument { { "path", "$QuestionCategoryIds" }, { "preserveNullAndEmptyArrays", false } }),
            new BsonDocument("$group",
                new BsonDocument
                {
                    { "_id", "$QuestionCategoryIds" }, { "TotalQuestions", new BsonDocument("$sum", 1) },
                }),
            new BsonDocument("$merge",
                new BsonDocument
                {
                    { "into", "CategorySummary" },
                    { "on", "_id" },
                    { "whenMatched", "replace" },
                    { "whenNotMatched", "insert" },
                }),
        };

        await DB.Collection<Data.Question>().AggregateAsync<BsonDocument>(pipeline, cancellationToken: cancellationToken);
        return TypedResults.Ok();
    }
}
