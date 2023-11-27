using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.Question.Contracts;
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

    private static async Task<List<QuestionCategory>> GetQuestionCategories(CancellationToken cancellationToken) => await DB.Find<QuestionCategory>().ManyAsync(_ => true, cancellationToken);

    private static async Task<List<QuestionPriority>> GetQuestionPriorities(CancellationToken cancellationToken) => await DB.Find<QuestionPriority>().ManyAsync(_ => true, cancellationToken);

    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder.MapGet("/configurations", GetQuestionConfigurations).WithName("GetQuestionConfigurations");
}
