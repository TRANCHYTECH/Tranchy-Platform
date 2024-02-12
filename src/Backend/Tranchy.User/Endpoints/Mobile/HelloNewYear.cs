namespace Tranchy.User.Endpoints.Mobile;

public class HelloNewYear: IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder.MapGet("/years/2024:hello",
        () => TypedResults.Ok("Hello lunar new year 2024. Wishing you all the magic of the new year."));
}
