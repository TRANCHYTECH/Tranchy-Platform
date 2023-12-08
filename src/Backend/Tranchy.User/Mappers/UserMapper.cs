using Mapster;
using Tranchy.User.Endpoints;
using Tranchy.User.Responses;

namespace Tranchy.User.Mappers;

internal static class UserMapper
{
    internal static GetUserResponse FromEntity(this Data.User data) => data.BuildAdapter().AdaptToType<GetUserResponse>();
    internal static Data.User ToEntity(this CreateUserRequest request) => request.BuildAdapter().AdaptToType<Data.User>();

    static UserMapper()
    {
        TypeAdapterConfig<Data.User, GetUserResponse>.NewConfig();
        TypeAdapterConfig<CreateUserRequest, Data.User>.NewConfig();
    }
}
