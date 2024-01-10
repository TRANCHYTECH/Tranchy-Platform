using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Question.Consumers;
using Tranchy.Common.Services;
using IdGen;
namespace Tranchy.Question.Endpoints;

public class CreateQuestion : IEndpoint
{
    public static async Task<
        Results<Ok<CreateQuestionResponse>, BadRequest<IDictionary<string, string[]>>>
    > Create(
        [FromBody] CreateQuestionRequest request,
        [FromServices] IValidator<Data.Question> questionValidator,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateQuestion> logger,
        [FromServices] ITenant tenant,
        [FromServices] IdGenerator idGenerator,
        CancellationToken cancellation
    )
    {
        var newQuestion = request.ToEntity(tenant.UserId, idGenerator.CreateId());
        await questionValidator.TryValidate(newQuestion, cancellation);

        // var queryIndex = await DB.NextSequentialNumberAsync<Data.Question>(cancellation);
        await dbContext.BeginTransaction(cancellation);
        await DB.InsertAsync(newQuestion, dbContext.Session, cancellation);

        await publishEndpoint.Publish(new QuestionCreated { Id = newQuestion.ID! }, cancellation);

        Commands.VerifyQuestion command = new() { Id = newQuestion.ID! };

        await sendEndpointProvider.Send(
            command,
            endpointNameFormatter.Consumer<VerifyQuestionConsumer>(),
            cancellation
        );
        await dbContext.CommitTransaction(cancellation);

        logger.CreatedQuestion(newQuestion.ID, newQuestion.Title);

        return TypedResults.Ok(new CreateQuestionResponse
        {
            Id = newQuestion.ID
        });
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder) =>
        routeGroupBuilder.MapPost("/", Create).WithName("CreateQuestion");
}
