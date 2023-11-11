using MongoDB.Entities;

namespace Tranchy.Question.Data;

public class EntityBase : Entity, ICreatedOn, IModifiedOn
{
    public DateTime CreatedOn { get; set; }

    public DateTime ModifiedOn { get; set; }
}
