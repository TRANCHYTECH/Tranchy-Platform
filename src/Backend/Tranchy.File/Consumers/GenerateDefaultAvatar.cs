using Azure.Storage.Blobs;
using Jdenticon;
using Microsoft.Extensions.DependencyInjection;
using Tranchy.Common.Events.User;

namespace Tranchy.File.Consumers;

public class GenerateDefaultAvatar([FromKeyedServices("avatar")] BlobContainerClient blobContainerClient) : IConsumer<UserCreatedEvent>
{
    public async Task Consume(ConsumeContext<UserCreatedEvent> context)
    {
        var icon = Identicon.FromValue(context.Message.UserId, 120);
        await using var stream = icon.SaveAsPng();
        await blobContainerClient.UploadBlobAsync($"{context.Message.UserId}.jpg", stream);
    }
}
