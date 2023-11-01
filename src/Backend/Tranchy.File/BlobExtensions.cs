using Azure.Identity;

namespace Azure.Storage.Blobs;

public static class BlobExtensions
{
    public static BlobContainerClient GetBlobContainerClient(this Uri containerUri, CancellationToken cancellation = default)
    {
        BlobContainerClient container = new(containerUri, new DefaultAzureCredential());

        // todo: move to deployment 
        container.CreateIfNotExists(cancellationToken: cancellation);

        return container;
    }
}
