using Microsoft.AspNetCore.Builder;
using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Question.Endpoints;
using Tranchy.Question.Commands;
using Tranchy.Question.Consumers;
using Tranchy.Common.Services;
using Tranchy.Question.Mappers;
using Tranchy.Question.Contracts;
using Tranchy.Common.Validators;

namespace Tranchy.Question.Integrations.Endpoints;

public class CreateQuestion : IEndpoint
{
    public static async Task<IResult> Create(
        [FromBody] CreateQuestionInput input,
        [FromServices] IValidator<CreateQuestionInput> validator,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateQuestion> logger,
        [FromServices] ITenant tenant,
        CancellationToken token
    )
    {
        IDictionary<string, string[]>? errors = null;

        if (input == null || (!await validator.IsValidAsync(input, out errors)))
        {
            return TypedResults.BadRequest(errors);
        }

        var newQuestion = input.ToDbQuestion(tenant.UserId);

        await dbContext.BeginTransaction(token);

        await DB.InsertAsync(newQuestion, dbContext.Session, token);

        await publishEndpoint.Publish(new QuestionCreated { Id = newQuestion.ID! }, token);

        VerifyQuestion command = new() { Id = newQuestion.ID! };

        await sendEndpointProvider.Send(
            command,
            endpointNameFormatter.Consumer<VerifyQuestionConsumer>()
        );
        await dbContext.CommitTransaction(token);

        logger.CreatedQuestion(newQuestion.ID!, newQuestion.Title);

        return TypedResults.Ok<QuestionOutput>(new(newQuestion.ID!));
    }

    public static void Register(RouteGroupBuilder routeGroupBuilder)
    {
        routeGroupBuilder.MapPost("/", Create).WithName("CreateQuestion");
    }
}
