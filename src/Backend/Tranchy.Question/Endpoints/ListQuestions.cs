
using System.Linq.Expressions;
using Microsoft.AspNetCore.Builder;
using MongoDB.Entities;
using Tranchy.Common.Services;
using Tranchy.Question.Data;

namespace Tranchy.Question.Endpoints
{
    public class ListQuestions : IEndpoint
    {
        public static async Task<IResult> ListPublicQuestions()
        {
            var acceptedStatuses = new[] { QuestionStatus.Accepted };
            var questions = await DB.Find<Data.Question>().Match(q => acceptedStatuses.Contains(q.Status)).ExecuteAsync();

            return TypedResults.Ok(questions);
        }

        public static async Task<IResult> ListMyQuestions([FromServices] ITenant tenant)
        {
            var questions = await DB.Find<Data.Question>().Mine(tenant).ExecuteAsync();

            return TypedResults.Ok(questions);
        }

        public static void Register(RouteGroupBuilder routeGroupBuilder)
        {
            routeGroupBuilder.MapGet("/list/public", ListPublicQuestions).WithName("ListPublicAcceptedQuestions");
            routeGroupBuilder.MapGet("/list/mine", ListPublicQuestions).WithName("ListMyQuestions");
        }
    }
}