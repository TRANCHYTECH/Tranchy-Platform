using MongoDB.Bson;
using Tranchy.Common.Data;

namespace Tranchy.Question.Data;

public class QueryParameters
{
    public bool? Other { get; init; }
    public SupportLevel? SupportLevel { get; init; }
    public QuestionStatus? Status { get; init; }
    public IEnumerable<string>? Categories { get; init; }
    public SortingType CreatedAtSortingType { get; init; } = SortingType.Ascending;
    public int Limit { get; init; } = 10;
    public SortingType? PrioritySorting { get; init; }
    public IEnumerable<string>? ExceptIds { get; init; }
    public bool ProjectionTypeQuestionBrief { get; set; } = true;
}

public class QuestionQueryBuilder
{
    private readonly List<BsonDocument> _aggregate = [];

    private void WithOther() => _aggregate.Add(new BsonDocument("$match",
        new BsonDocument("CreatedByUserId", new BsonDocument("$ne", "$$user_id"))));

    private void WithSupportLevel(SupportLevel level) =>
        _aggregate.Add(new BsonDocument("$match", new BsonDocument("SupportLevel", level)));

    private void WithStatus(QuestionStatus status) =>
        _aggregate.Add(new BsonDocument("$match", new BsonDocument("Status", status)));

    private void WithLimit(int number) => _aggregate.Add(new BsonDocument("$limit", number));

    private void WithCategories(IEnumerable<string> categories) =>
        _aggregate.Add(new BsonDocument("$match",
            new BsonDocument("$expr",
                new BsonDocument("$not",
                    new BsonDocument("$eq",
                        new BsonArray
                        {
                            new BsonDocument("$setIntersection",
                                new BsonArray { "$QuestionCategoryIds", new BsonArray(categories) }),
                            new BsonArray()
                        })))));

    private void WithCreatedSort(SortingType sortingType) =>
        _aggregate.Add(new BsonDocument("$sort", new BsonDocument("CreatedOn", sortingType)));

    private void WithPrioritySort(SortingType sortingType) =>
        _aggregate.Add(new BsonDocument("$sort", new BsonDocument("PriorityId", sortingType)));

    private void WithExceptIds(IEnumerable<string> questionIds) => _aggregate.Add(new BsonDocument("$match",
        new BsonDocument("_id",
            new BsonDocument("$nin",
                new BsonArray(questionIds.Select(id => new ObjectId(id)).ToArray())))));

    private void WithProjectionBrief() => _aggregate.Add(new BsonDocument("$project",
        new BsonDocument
        {
            { "ID", new BsonDocument("$toString", "$_id") },
            { "Title", 1 },
            { "Categories", "$QuestionCategoryIds" },
            { "CreatedOn", 1 },
            { "CreatedBy", "$CreatedByUserId" }
        }));

    private BsonDocument[] Value() => _aggregate.ToArray();

    public static BsonDocument[] Parse(QueryParameters queryParams)
    {
        var builder = new QuestionQueryBuilder();
        if (queryParams.Other == true)
        {
            builder.WithOther();
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

        if (queryParams.Categories?.Count() > 0)
        {
            builder.WithCategories(queryParams.Categories);
        }

        if (queryParams.PrioritySorting.HasValue)
        {
            builder.WithPrioritySort(queryParams.PrioritySorting.Value);
        }

        builder.WithCreatedSort(queryParams.CreatedAtSortingType);

        if (queryParams.Limit is < 0 or > 100)
        {
            throw new AggregateException(nameof(queryParams.Limit) + " invalid");
        }

        builder.WithLimit(queryParams.Limit);

        if (queryParams.ProjectionTypeQuestionBrief)
        {
            builder.WithProjectionBrief();
        }

        return builder.Value();
    }
}
