using System.Net.Mime;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Tranchy.Ask.API;

public static class EndpointRouteBuilderExtensions
{
    public static void MapTranchyHealthChecks(this IEndpointRouteBuilder builder) =>
        builder.MapHealthChecks("/healthz",
            new HealthCheckOptions
            {
                ResponseWriter = async (context, report) =>
                {
                    string result = JsonSerializer.Serialize(
                        new
                        {
                            status = report.Status.ToString(),
                            monitors = report.Entries.Select(e => new
                            {
                                key = e.Key, value = Enum.GetName(typeof(HealthStatus), e.Value.Status)
                            })
                        });
                    context.Response.ContentType = MediaTypeNames.Application.Json;
                    await context.Response.WriteAsync(result, cancellationToken: context.RequestAborted);
                }
            }
        );
}
