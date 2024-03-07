using MongoDB.Entities;

namespace Tranchy.Common.Data;

public interface IOwnEntity : IEntity
{
    string CreatedBy { get; init; }
}
