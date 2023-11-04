using Microsoft.AspNetCore.Builder;
using Tranchy.Question.Events;
using MongoDB.Entities;
using MassTransit.MongoDbIntegration;
using Tranchy.Question.Consumers;
using Tranchy.Common.Services;
using Tranchy.Question.Mappers;
using Tranchy.Question.Contracts;
using FluentValidation;

namespace Tranchy.Question.Endpoints;

public class CreateQuestion : IEndpoint
{
    public static async Task<Results<Ok<QuestionOutput>, BadRequest<IDictionary<string, string[]>>>> Create(
        [FromBody] CreateQuestionInput input,
        [FromServices] IValidator<Data.Question> questionValidator,
        [FromServices] IEndpointNameFormatter endpointNameFormatter,
        [FromServices] MongoDbContext dbContext,
        [FromServices] ISendEndpointProvider sendEndpointProvider,
        [FromServices] IPublishEndpoint publishEndpoint,
        [FromServices] ILogger<CreateQuestion> logger,
        [FromServices] ITenant tenant,
        CancellationToken token
    )
    {
        var newQuestion = input.ToDbQuestion(tenant.UserId);

        await questionValidator.TryValidate(newQuestion, token);

        await dbContext.BeginTransaction(token);

        await DB.InsertAsync(newQuestion, dbContext.Session, token);

        await publishEndpoint.Publish(new QuestionCreated { Id = newQuestion.ID! }, token);

        Commands.VerifyQuestion command = new() { Id = newQuestion.ID! };

        await sendEndpointProvider.Send(
            command,
            endpointNameFormatter.Consumer<VerifyQuestionConsumer>(),
            token
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
