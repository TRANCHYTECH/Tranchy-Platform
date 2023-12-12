using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.User.Mappers;
using Tranchy.User.Responses;

namespace Tranchy.User.Endpoints;

public class GetUserNotification : IEndpoint
{
    [ProducesResponseType<GetUserResponse>(200)]
    public static async Task<Ok<IEnumerable<GetUserNotificationResponse>>> Get([FromServices] ITenant tenant, CancellationToken cancellationToken)
    {
        var notifications = await DB.Find<Data.UserNotification>().Match(n => n.UserId == tenant.UserId).ExecuteAsync(cancellationToken);

        return TypedResults.Ok(notifications.Select(n => n.FromEntity()));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapGet("Notifications", Get).WithName("GetUserNotification").WithTags("User");
    }
}
