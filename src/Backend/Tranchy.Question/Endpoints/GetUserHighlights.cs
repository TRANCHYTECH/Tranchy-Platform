using Bogus;

namespace Tranchy.Question.Endpoints;

public class GetUserHighlights : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapGet("/aggregate/user-highlights", HighlightSectionsFunction)
            .WithName("GetUserHighlights")
            .WithSummary("Get highlights for user")
            .WithTags("Aggregates")
            .WithOpenApi();

    private static Ok<GetUserHighlightsResponse> HighlightSectionsFunction()
    {
        var faker = new Faker("vi");

        var response = new GetUserHighlightsResponse();

        for (int i = 0 ; i  <= 4; i ++)
        {
            response.ExpertExclusive.Data.Add(new QuestionBrief
            {
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 300.000",
                CreatedBy = "643b93cb5c7266dc77f91f29",
                CreatedAt = DateTime.UtcNow
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.Recent.Data.Add(new QuestionBrief
            {
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 500.00",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "643b93cb5c7266dc77f91f29"
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.MatchProfile.Data.Add(new QuestionBrief
            {
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 500.00",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "643b93cb5c7266dc77f91f29"
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.PopularCategories.Data.Add(new CategoryBrief
            {
                Title = faker.Commerce.Categories(1).First()
            });
        }

        return TypedResults.Ok(response);
    }
}
