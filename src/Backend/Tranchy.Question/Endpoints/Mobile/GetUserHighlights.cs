using MongoDB.Bson;
using MongoDB.Driver;
using Tranchy.Common.Constants;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.Mobile;

public class GetUserHighlights : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet("/aggregates/user-highlights", HighlightSectionsFunction)
        .WithName("GetUserHighlights")
        .WithSummary("Get highlights for user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<GetUserHighlightsResponse>> HighlightSectionsFunction(
        [FromServices] ITenant tenant,
        CancellationToken cancellation)
    {
        GetUserHighlightsResponse response = new();

#pragma warning disable IDE0090 // Use 'new(...)'
        var aggregatePipeline = new BsonDocument[]
                                    {
                                        new BsonDocument("$match",
                                        new BsonDocument
                                            {
                                                { "Status", 3 },
                                                { "CreatedByUserId", new BsonDocument("$ne", tenant.UserId) }
                                            }),
                                        new BsonDocument("$facet",
                                        new BsonDocument
                                            {
                                                { "TopQuestionsBySupportLevels",
                                        new BsonArray
                                                {
                                                    new BsonDocument("$bucket",
                                                    new BsonDocument
                                                        {
                                                            { "groupBy", "$SupportLevel" },
                                                            { "boundaries",
                                                    new BsonArray
                                                            {
                                                                1,
                                                                2,
                                                                3,
                                                            } },
                                                            { "default", "Other" },
                                                            { "output",
                                                    new BsonDocument("Questions",
                                                    new BsonDocument("$topN",
                                                    new BsonDocument
                                                                    {
                                                                        { "sortBy",
                                                    new BsonDocument("CreatedOn", -1) },
                                                                        { "output",
                                                    new BsonDocument
                                                                        {
                                                                            { "ID",
                                                    new BsonDocument("$toString", "$_id") },
                                                                            { "Title", "$Title" },
                                                                            { "Categories", "$QuestionCategoryIds" },
                                                                            { "Status", "$Status" },
                                                                            { "CreatedBy", "$CreatedByUserId" },
                                                                            { "CreatedOn", "$CreatedOn" }
                                                                        } },
                                                                        { "n", 15 }
                                                                    })) }
                                                        })
                                                } },
                                                { "TopCategories",
                                        new BsonArray
                                                {
                                                    new BsonDocument("$unwind",
                                                    new BsonDocument
                                                        {
                                                            { "path", "$QuestionCategoryIds" },
                                                            { "preserveNullAndEmptyArrays", false }
                                                        }),
                                                    new BsonDocument("$group",
                                                    new BsonDocument
                                                        {
                                                            { "_id", "$QuestionCategoryIds" },
                                                            { "TotalQuestions",
                                                    new BsonDocument("$sum", 1) }
                                                        }),
                                                    new BsonDocument("$sort",
                                                    new BsonDocument("TotalQuestions", -1)),
                                                    new BsonDocument("$limit", 5)
                                                } },
                                            })
                                    };
#pragma warning restore IDE0090 // Use 'new(...)'

        var cursor = await DB.Collection<Data.Question>().AggregateAsync<HighlightAggregate>(aggregatePipeline, new AggregateOptions
        {
            // todo: reasearch how to pass let definition to aggregate.
            Let = new BsonDocument("user_id", tenant.UserId)
        }, cancellationToken: cancellation);
        var result = await cursor.FirstOrDefaultAsync(cancellation);

        var expertQuestions = result.TopQuestionsBySupportLevels.SingleOrDefault(t => t.Id == SupportLevel.Expert);
        if (expertQuestions is not null)
        {
            response.ExpertExclusive.Data = expertQuestions.Questions.Take(5).ToList();
            response.Recent.Data = expertQuestions.Questions.Skip(5).Take(5).ToList();
            response.MatchProfile.Data = expertQuestions.Questions.Skip(10).Take(5).ToList();
        }

        response.PopularCategories.Data = result.TopCategories;

        return TypedResults.Ok(response);
    }
}
