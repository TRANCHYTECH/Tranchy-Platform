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
        var response = new HighlightSectionsResponse();

        response.ExpertExclusive.Data.Add(new QuestionBrief
        {
            Title = "Question 1",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 300.000"
        });
        response.ExpertExclusive.Data.Add(new QuestionBrief
        {
            Title = "Question 2",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 400.000"
        });
        response.ExpertExclusive.Data.Add(new QuestionBrief
        {
            Title = "Question 3",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000"
        });

        response.Recent.Data.Add(new QuestionBrief
        {
            Title = "Question 1",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000",
            CreatedAt = new DateTime()
        });
        response.Recent.Data.Add(new QuestionBrief
        {
            Title = "Question 2",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000",
            CreatedAt = new DateTime()
        });
        response.Recent.Data.Add(new QuestionBrief
        {
            Title = "Question 3",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000",
            CreatedAt = new DateTime()
        });

        response.MatchProfile.Data.Add(new QuestionBrief
        {
            Title = "Question 1",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000",
            CreatedAt = new DateTime()
        });

        response.MatchProfile.Data.Add(new QuestionBrief
        {
            Title = "Question 2",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000",
            CreatedAt = new DateTime()
        });
        response.MatchProfile.Data.Add(new QuestionBrief
        {
            Title = "Question 3",
            Categories = ["Category 1", "Category 2"],
            Price = "VND 500.000",
            CreatedAt = new DateTime()
        });

        response.PopularCategories.Data.Add(new CategoryBrief
        {
            Title = "Category 1"
        });
        response.PopularCategories.Data.Add(new CategoryBrief
        {
            Title = "Category 2"
        });

        return TypedResults.Ok(response);
    }
}
