using Microsoft.AspNetCore.OData.Routing.Controllers;
using MongoDB.AspNetCore.OData;
using MongoDB.Driver;

namespace Tranchy.Question.Endpoints.BackOffice;

public class QuestionsController : ODataController
{
    private readonly IQueryable<Data.Question> _questions = DB.Collection<Data.Question>().AsQueryable();

    [MongoEnableQuery]
    public ActionResult Get() => Ok(_questions);
}
