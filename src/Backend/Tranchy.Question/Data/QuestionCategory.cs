using MongoDB.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tranchy.Question.Data
{

    [Collection("QuestionCategory")]
    public class QuestionCategory : Entity, ICreatedOn, IModifiedOn
    {
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;

        public DateTime CreatedOn { get; set; } = default!;
        public DateTime ModifiedOn { get; set; } = default!;
    }
}
