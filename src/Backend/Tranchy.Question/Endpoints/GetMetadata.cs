using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints;

public class GetMetadata : IEndpoint
{
    public static async Task<Ok<GetQuestionConfigurationsResponse>> GetQuestionConfigurations([FromServices] ITenant tenant, CancellationToken cancellationToken)
    {
        var response = new GetQuestionConfigurationsResponse
        {
            UserId = tenant.UserId,
            Email = tenant.Email,
            QuestionCategories = await GetQuestionCategories(cancellationToken),
            QuestionPriorities = await GetQuestionPriorities(cancellationToken),
        };

        return TypedResults.Ok(response);
    }

    private static async Task<List<QuestionCategoryResponse>> GetQuestionCategories(CancellationToken cancellationToken)
        => await DB.Find<QuestionCategory, QuestionCategoryResponse>().Match(_ => true)
            .Project(c => new QuestionCategoryResponse
            {
                Key = c.Key,
                Title = c.Title,
                Description = c.Description
            })
            .ExecuteAsync(cancellationToken);

    private static async Task<List<QuestionPriorityResponse>> GetQuestionPriorities(CancellationToken cancellationToken)
        => await DB.Find<QuestionPriority, QuestionPriorityResponse>().Project(c => new QuestionPriorityResponse
        {
            Key = c.Key,
            Title = c.Title,
            Description = c.Description,
            Duration = c.Duration,
            PriorityMetaData = c.PriorityMetaData,
            Rank = c.Rank
        }).ManyAsync(_ => true, cancellationToken);

    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder.MapGet("/configurations", GetQuestionConfigurations).WithName("GetQuestionConfigurations");
}
