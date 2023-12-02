using Mapster;
using Tranchy.User.Responses;

namespace Tranchy.User.Mappers;

internal static class UserMapper
{
    internal static GetUserResponse FromEntity(this Data.User data) => data.BuildAdapter().AdaptToType<GetUserResponse>();

    static UserMapper()
    {
        TypeAdapterConfig<Data.User, GetUserResponse>
        .NewConfig();
    }
}
