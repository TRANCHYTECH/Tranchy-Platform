using IdGen;
using MassTransit.MongoDbIntegration;
using Tranchy.Common.Constants;
using Tranchy.Common.Services;
using Tranchy.Common.Validators;
using Tranchy.Question.Consumers;
using Tranchy.Question.Events;

namespace Tranchy.Question.Endpoints.Mobile;

public class CreateQuestion : IEndpoint
{
    public static void Register(RouteGroupBuilder routeGroupBuilder) => routeGroupBuilder
        .MapPost("/", Create)
        .WithName("CreateQuestion")
        .WithSummary("Create question")
        .WithTags(Tags.Mobile)
        .WithOpenApi();

    private static async Task<Results<Ok<CreateQuestionResponse>, BadRequest<IDictionary<string, string[]>>>> Create(
        [FromBody] CreateQuestionRequest request,
        [FromServices] IValidator<Data.Question> questionValidator,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateQuestion> logger,
        [FromServices] ITenant tenant,
        [FromServices] IdGenerator idGenerator,
        CancellationToken cancellation)
    {
        var newQuestion = request.ToEntity(tenant.UserId, idGenerator.CreateId());
        await questionValidator.TryValidate(newQuestion, cancellation);

        await dbContext.BeginTransaction(cancellation);
        await DB.InsertAsync(newQuestion, dbContext.Session, cancellation);
        await publishEndpoint.Publish(new QuestionCreated { Id = newQuestion.ID! }, cancellation);
        // Commands.VerifyQuestion command = new() { Id = newQuestion.ID! };
        // await sendEndpointProvider.Send(
        //     command,
        //     endpointNameFormatter.Consumer<VerifyQuestionConsumer>(),
        //     cancellation
        // );
        await dbContext.CommitTransaction(cancellation);

        logger.CreatedQuestion(newQuestion.ID, newQuestion.Title);

        return TypedResults.Ok(new CreateQuestionResponse { Id = newQuestion.ID });
    }
}
