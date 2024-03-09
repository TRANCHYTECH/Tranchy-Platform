using MongoDB.Bson;
using Tranchy.Common.Constants;

namespace Tranchy.Question.Data;

public class QuestionQueryBuilder
{
    private readonly List<BsonDocument> _aggregate = [];

    private void WithOther() => _aggregate.Add(new BsonDocument("$match",
        new BsonDocument("$expr", new BsonDocument("$ne", new BsonArray { "$CreatedBy", "$$user" }))));

    private void WithMine() => _aggregate.Add(new BsonDocument("$match",
        new BsonDocument("$expr", new BsonDocument("$eq", new BsonArray { "$CreatedBy", "$$user" }))));

    private void WithSupportLevel(SupportLevel level) =>
        _aggregate.Add(new BsonDocument("$match", new BsonDocument("SupportLevel", level)));

    private void WithStatus(QuestionStatus status) =>
        _aggregate.Add(new BsonDocument("$match", new BsonDocument("Status", status)));

    private void WithStatuses(QuestionStatus[] statues) =>
        _aggregate.Add(new BsonDocument("$match",
            new BsonDocument("Status", new BsonDocument("$in", new BsonArray(statues)))));

    private void WithMyConsultation() => _aggregate.Add(new BsonDocument("$match",
        new BsonDocument
        {
            { "Consultant", new BsonDocument("$ne", BsonNull.Value) },
            { "$expr", new BsonDocument("$eq", new BsonArray { "$Consultant.User", "$$user" }) },
        }));

    private void WithLimit(int number) => _aggregate.Add(new BsonDocument("$limit", number));

    private void WithCategories(IEnumerable<string> categories) =>
        _aggregate.Add(new BsonDocument("$match",
            new BsonDocument("$expr",
                new BsonDocument("$not",
                    new BsonDocument("$eq",
                        new BsonArray
                        {
                            new BsonDocument("$setIntersection",
                                new BsonArray { "$CategoryIds", new BsonArray(categories) }),
                            new BsonArray()
                        })))));

    private void WithCreatedSort(SortingType sortingType) =>
        _aggregate.Add(new BsonDocument("$sort", new BsonDocument("CreatedOn", sortingType)));

    private void WithQueryIndex(string matchType, long queryIndex) => _aggregate.Add(
        new BsonDocument("$match", new BsonDocument("QueryIndex", new BsonDocument(matchType, queryIndex))));

    private void WithPrioritySort(SortingType sortingType) =>
        _aggregate.Add(new BsonDocument("$sort", new BsonDocument("PriorityId", sortingType)));

    private void WithExceptIds(IEnumerable<string> questionIds) => _aggregate.Add(new BsonDocument("$match",
        new BsonDocument("_id",
            new BsonDocument("$nin",
                new BsonArray(questionIds.Select(id => new ObjectId(id)).ToArray())))));

    private void WithProjectQuestionBrief() => _aggregate.Add(new BsonDocument("$project",
        new BsonDocument
        {
            { "ID", new BsonDocument("$toString", "$_id") },
            { "Title", 1 },
            { "Categories", "$CategoryIds" },
            { "CreatedOn", 1 },
            { "QueryIndex", 1 },
            { "CreatedBy", 1 }
        }));

    private BsonDocument[] Value() => [.. _aggregate];

    public static BsonDocument[] Parse(QueryQuestionsRequest queryParams)
    {
        var builder = new QuestionQueryBuilder();
        if (queryParams.Other == true)
        {
            builder.WithOther();
        }

        if (queryParams.Mine == true)
        {
            builder.WithMine();
        }

        if (queryParams.ExceptIds?.Count() > 0)
        {
            builder.WithExceptIds(queryParams.ExceptIds);
        }

        if (queryParams.SupportLevel.HasValue)
        {
            builder.WithSupportLevel(queryParams.SupportLevel.Value);
        }

        if (queryParams.Status.HasValue)
        {
            builder.WithStatus(queryParams.Status.Value);
        }

        if (queryParams.Statuses?.Length > 0)
        {
            builder.WithStatuses(queryParams.Statuses);
        }

        if (queryParams.Categories?.Count() > 0)
        {
            builder.WithCategories(queryParams.Categories);
        }

        if (queryParams.PrioritySorting.HasValue)
        {
            builder.WithPrioritySort(queryParams.PrioritySorting.Value);
        }

        if (queryParams.MyConsultation == true)
        {
            builder.WithMyConsultation();
        }

        // Go together.
        builder.WithCreatedSort(queryParams.CreatedAtSortingType);
        if (queryParams.QueryIndex.HasValue)
        {
            string matchType = queryParams.CreatedAtSortingType == SortingType.Ascending ? "$gte" : "$lte";
            builder.WithQueryIndex(matchType, queryParams.QueryIndex.Value);
        }

        if (queryParams.Limit is < 0 or > 100)
        {
            throw new AggregateException(nameof(queryParams.Limit) + " invalid");
        }

        builder.WithLimit(queryParams.ApplyPagination ? queryParams.Limit + 1 : queryParams.Limit);

        if (queryParams.ProjectQuestionBrief)
        {
            builder.WithProjectQuestionBrief();
        }

        return builder.Value();
    }
}
