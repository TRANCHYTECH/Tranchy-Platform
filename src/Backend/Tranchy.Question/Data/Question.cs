using MongoDB.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tranchy.Question.Data
{
    [Collection("Question")]
    public class Question : Entity, ICreatedOn
    {
        public string Title { get; set; } = default!;
        public DateTime CreatedOn { get; set; } = default!;
    }
}
