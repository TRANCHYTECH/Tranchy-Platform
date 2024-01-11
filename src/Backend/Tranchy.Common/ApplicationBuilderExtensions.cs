using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Tranchy.Common.Exceptions;

namespace Tranchy.Common;

public static class ApplicationBuilderExtensions
{
    public static void UseTranchyExceptionHandler(this IApplicationBuilder app) =>
        app.UseExceptionHandler(configure => configure.Run(async context =>
        {
            var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            if (exceptionHandlerPathFeature?.Error is TranchyAteChillyException ex)
            {
                await Results.BadRequest(new ErrorDetails { Error = ex.Message }).ExecuteAsync(context);
            }
        }));
}
