using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using Tranchy.Common.Events;

namespace Tranchy.Question.Integrations.Endpoints;

public record UploadQuestionFileResponse(string QuestionId);

public class UploadQuestionFile : IEndpoint
{
    //todo: how to encrypt questionId, so that this api could verify easily like test session of test master.
    public static async Task<Results<Ok<UploadQuestionFileResponse>, BadRequest>> Upload(
        [FromServices] IOptions<AppSettings> appSettings,
        [FromServices] IBus publishEndpoint,
        [FromRoute] string questionId,
        [FromQuery] string fileName,
        IFormFile file,
        CancellationToken cancellation = default)
    {
        //todo: app settings, depend on file types.
        const int maxSize = 1024 * 1024 * 10;
        using var fileContent = file.OpenReadStream();
        if (fileContent.Length > maxSize)
        {
            return TypedResults.BadRequest();
        }

        var container = new Uri(appSettings.Value.File.UnsafeQuestionFileContainerUri).GetBlobContainerClient(cancellation);
        //todo: move to deployment bicep.
        await container.CreateIfNotExistsAsync(cancellationToken: cancellation);

        string finalizedFileName = fileName ?? file.FileName;
        var blob = container.GetBlobClient($"{questionId}/{finalizedFileName}");
        await blob.UploadAsync(fileContent, new BlobUploadOptions
        {
            Metadata = new Dictionary<string, string>(StringComparer.Ordinal)
            {
                { "TranchyQuestionId", questionId },
                { "TranchyFileName", finalizedFileName }
            },
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = file.ContentType
            }
        }, cancellation);

        await publishEndpoint.Publish(new QuestionFileUploaded { QuestionId = questionId, FilePath = blob.Uri.AbsolutePath }, cancellation);

        return TypedResults.Ok<UploadQuestionFileResponse>(new(questionId));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/question/{questionId}", Upload).WithName("UploadFileForQuestion");
    }
}
