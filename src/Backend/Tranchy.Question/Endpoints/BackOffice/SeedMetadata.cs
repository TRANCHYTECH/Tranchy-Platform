using System.Diagnostics.CodeAnalysis;
using Tranchy.Common.Constants;
using Tranchy.Common.Data;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints.BackOffice;

public class SeedMetadata : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/development-supports:seed-metadata", Seed)
        .WithName("SeedMetadata")
        .WithTags(Tags.DevelopmentSupport)
        .WithOpenApi();

    [SuppressMessage("Design", "MA0051:Method is too long")]
    private static async Task<Ok> Seed(CancellationToken cancellation)
    {
        var questionCategories = new QuestionCategory[]
        {
            new()
            {
                Key = "technology",
                Title = LocalizedString.Create("Công nghệ", "Technology"),
                Description =
                    LocalizedString.Create("Các câu hỏi liên quan đến công nghệ thông tin",
                        "Question related to IT")
            },
            new()
            {
                Key = "law",
                Title = LocalizedString.Create("Luật", "Law"),
                Description =
                    LocalizedString.Create("Các câu hỏi liên quan đến luật", "Question related to law")
            },
            new()
            {
                Key = "finance",
                Title = LocalizedString.Create("Tài chính", "Finance"),
                Description =
                    LocalizedString.Create("Các câu hỏi liên quan đến tài chính", "Question related to finance")
            },
            new()
            {
                Key = "education",
                Title = LocalizedString.Create("Giáo dục", "Education"),
                Description =
                    LocalizedString.Create("Các câu hỏi liên quan đến giáo dục",
                        "Question related to education")
            },
            new()
            {
                Key = "accountant",
                Title = LocalizedString.Create("Kế toán", "accountant"),
                Description = LocalizedString.Create("Các câu hỏi liên quan đến kế toán",
                    "Question related to accountant")
            }
        };
        await DB.DeleteAsync<QuestionCategory>(_ => true, cancellation: default);
        await DB.InsertAsync(questionCategories, cancellation: cancellation);

        var questionPriorities = new QuestionPriority[]
        {
            new()
            {
                Key = "urgent",
                Rank = 3,
                Title = LocalizedString.Create("Gấp", "Urgent"),
                Description = LocalizedString.Create("Tôi cần trả lời gấp", "I need the answer as right now")
            },
            new()
            {
                Key = "today",
                Rank = 5,
                Title = LocalizedString.Create("Hôm nay", "today"),
                Description = LocalizedString.Create("Tôi cần trả lời hôm nay", "I need the answer as today")
            },
            new()
            {
                Key = "week",
                Rank = 7,
                Title = LocalizedString.Create("Tuần", "week"),
                Description =
                    LocalizedString.Create("Tôi cần trả lời trong tuần", "I need the answer as this week")
            }
        };

        await DB.DeleteAsync<QuestionPriority>(_ => true, cancellation: default);
        await DB.InsertAsync(questionPriorities, cancellation: cancellation);

        return TypedResults.Ok();
    }
}
