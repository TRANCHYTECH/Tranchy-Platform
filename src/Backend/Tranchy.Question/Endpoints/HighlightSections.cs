using Bogus;

namespace Tranchy.Question.Endpoints;

public class HighlightSections : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapGet("/aggregate/highlight-sections", HighlightSectionsFunction)
            .WithName("HighlightSections")
            .WithSummary("Highlight each sections")
            .WithTags("Aggregates")
            .WithOpenApi();

    private static Ok<HighlightSectionsResponse> HighlightSectionsFunction()
    {
        var faker = new Faker("vi");

        var response = new HighlightSectionsResponse();

        for (int i = 0 ; i  <= 4; i ++)
        {
            response.ExpertExclusive.Data.Add(new QuestionBrief
            {
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 300.000"
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.Recent.Data.Add(new QuestionBrief
            {
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 500.00",
                CreatedAt = new DateTime()
            });
        }

        for (int i = 0; i <= 4; i++)
        {
            response.MatchProfile.Data.Add(new QuestionBrief
            {
                Title = faker.Lorem.Sentence(50),
                Categories = faker.Commerce.Categories(3),
                Price = "VND 500.00",
                CreatedAt = new DateTime()
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
