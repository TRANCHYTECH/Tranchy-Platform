using MongoDB.Entities;

namespace Tranchy.Common.Data;

public interface IOwnEntity : IEntity
{
    string CreatedByUserId { get; init; }
}
