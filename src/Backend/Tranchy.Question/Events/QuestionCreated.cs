using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tranchy.Question.Events
{
    public record QuestionCreated
    {
        public string Title { get; init; } = default!;
    }
}
