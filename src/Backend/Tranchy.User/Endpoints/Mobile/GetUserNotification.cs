using Tranchy.Common.Services;
using Tranchy.User.Data;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints.Mobile;

public class GetUserNotification : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapGet(Constants.CurrentUserSectionEndpointPrefix + "/notification", Get)
        .WithName("GetUserNotification")
        .WithSummary("Get notifications of current user")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Ok<IEnumerable<GetUserNotificationResponse>>> Get(
        [FromServices] ITenant tenant,
        CancellationToken cancellationToken)
    {
        var notifications = await DB.Find<UserNotification>()
            .Match(n => n.UserId == tenant.UserId)
            .ExecuteAsync(cancellationToken);

        return TypedResults.Ok(notifications.Select(n => n.FromEntity()));
    }
}
