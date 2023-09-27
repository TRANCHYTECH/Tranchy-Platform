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
        public required string Title { get; set; }

        public DateTime CreatedOn { get; set; } = default!;
    }

    [Collection("QuestionEvent")]
    public class QuestionEvent : Entity, ICreatedOn
    {
        public required string Event { get; set; } // Message, VideoCall, AudioCall, ScheduleCall, Like

        public required DateTime CreatedOn { get; set; }
    }
}
