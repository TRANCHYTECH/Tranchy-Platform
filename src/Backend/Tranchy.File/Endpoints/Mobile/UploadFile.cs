using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using Tranchy.Common.Constants;
using Tranchy.Common.Events.File;
using Tranchy.Common.Services;
using Tranchy.File.Responses;

namespace Tranchy.File.Endpoints.Mobile;

public class UploadFile : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/questions/{questionId}/files", Upload)
        .WithName("UploadQuestionFile")
        .WithSummary("Upload file for question")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    //todo: how to encrypt questionId, so that this api could verify easily like test session of test master.
    // use shortid lib id protection lib .net
    private static async Task<Results<Ok<UploadFileResponse>, BadRequest>> Upload(
        [FromServices] ITenant tenant,
        [FromServices] IOptions<AppSettings> appSettings,
        [FromServices] IBus publishEndpoint,
        [FromRoute] string questionId,
        [FromQuery] string? fileName,
        IFormFile file,
        CancellationToken cancellation = default)
    {
        //todo: app settings, depend on file types.
        const int maxSize = 1024 * 1024 * 10;
        await using var fileContent = file.OpenReadStream();
        if (fileContent.Length > maxSize)
        {
            return TypedResults.BadRequest();
        }

        var container =
            new Uri(appSettings.Value.File.UnsafeQuestionFileContainerUri).GetBlobContainerClient(cancellation);

        //todo: move to deployment bicep.
        await container.CreateIfNotExistsAsync(cancellationToken: cancellation);

        string finalizedFileName = fileName ?? file.FileName;
        var blob = container.GetBlobClient($"{questionId}/{finalizedFileName}");
        await blob.UploadAsync(fileContent,
            new BlobUploadOptions
            {
                Metadata = new Dictionary<string, string>(StringComparer.Ordinal)
                {
                    { "TranchyQuestionId", questionId },
                    { "TranchyFileName", finalizedFileName },
                    { "TranchyCreatedBy", tenant.Email }
                },
                HttpHeaders = new BlobHttpHeaders { ContentType = file.ContentType }
            }, cancellation);

        publishEndpoint.Publish(
            new QuestionFileUploadedEvent { QuestionId = questionId, FilePath = blob.Uri.AbsolutePath },
            cancellation).Forget();

        return TypedResults.Ok(new UploadFileResponse(questionId));
    }
}
