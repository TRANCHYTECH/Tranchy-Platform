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

        response.ExpertExclusive.Data = await DB.Find<Data.Question, QuestionBrief>()
            .Other(tenant)
            .Match(q => q.SupportLevel == SupportLevel.Expert && q.Status == QuestionStatus.Accepted)
            .Sort(q => q.CreatedOn, Order.Descending)
            .Project(q => new QuestionBrief
            {
                ID = q.ID,
                Title = q.Title,
                Categories = q.QuestionCategoryIds,
                CreatedOn = q.CreatedOn,
                Saved = false,
                Price = "vnd 500",
                CreatedBy = q.CreatedByUserId
            })
            .Limit(5)
            .ExecuteAsync(cancellation);

        response.Recent.Data = await DB.Find<Data.Question, QuestionBrief>()
            .Other(tenant)
            .Match(q => q.SupportLevel > SupportLevel.Community && q.Status == QuestionStatus.Accepted)
            .Sort(q => q.CreatedOn, Order.Descending)
            .Project(q => new QuestionBrief
            {
                ID = q.ID,
                Title = q.Title,
                Categories = q.QuestionCategoryIds,
                CreatedOn = q.CreatedOn,
                Saved = false,
                Price = "vnd 500",
                CreatedBy = q.CreatedByUserId
            })
            .Limit(5)
            .ExecuteAsync(cancellation);

        response.MatchProfile.Data = await DB.Find<Data.Question, QuestionBrief>()
            .Other(tenant)
            .Match(q => q.SupportLevel > SupportLevel.Community && q.Status == QuestionStatus.Accepted)
            .Sort(q => q.CreatedOn, Order.Descending)
            .Project(q => new QuestionBrief
            {
                ID = q.ID,
                Title = q.Title,
                Categories = q.QuestionCategoryIds,
                CreatedOn = q.CreatedOn,
                Saved = false,
                Price = "vnd 500",
                CreatedBy = q.CreatedByUserId
            })
            .Limit(5)
            .ExecuteAsync(cancellation);

        response.PopularCategories.Data = await DB.Find<Data.QuestionCategory, CategoryBrief>()
            .Project(c => new CategoryBrief { Title = c.Title })
            .ExecuteAsync(cancellation);

        return TypedResults.Ok(response);
    }
}
