using Bogus;
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
        var faker = new Faker("vi");

        var response = new GetUserHighlightsResponse();

        // Expert exclusive.
        // todo: by others, and status
        var query = await DB.Find<Data.Question, QuestionBrief>()
            // .Other(tenant)
            .Match(q => q.SupportLevel == SupportLevel.Expert && q.Status == QuestionStatus.New)
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

        response.ExpertExclusive.Data = query;
        for (int i = 0; i <= 4; i++)
        {
            response.Recent.Data.Add(new QuestionBrief
            {
                ID = $"{i}",
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 500.00",
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "643b93cb5c7266dc77f91f29"
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.MatchProfile.Data.Add(new QuestionBrief
            {
                ID = $"{i}",
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 500.00",
                CreatedOn = DateTime.UtcNow,
                CreatedBy = "643b93cb5c7266dc77f91f29"
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.PopularCategories.Data.Add(new CategoryBrief { Title = faker.Commerce.Categories(1).First() });
        }

        return TypedResults.Ok(response);
    }
}
