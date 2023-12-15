using Mapster;
using Tranchy.User.Endpoints;
using Tranchy.User.Requests;
using Tranchy.User.Responses;

namespace Tranchy.User.Mappers;

internal static class UserMapper
{
    internal static GetUserResponse FromEntity(this Data.User data) => data.BuildAdapter().AdaptToType<GetUserResponse>();
    internal static IEnumerable<GetUserExpertiseResponse> FromUserExpertiseEntity(this Data.User data)
        => data.Expertises.BuildAdapter().AdaptToType<IEnumerable<GetUserExpertiseResponse>>();
    internal static GetUserExpertiseResponse FromUserExpertiseEntity(this Data.UserExpertise data)
    => data.BuildAdapter().AdaptToType<GetUserExpertiseResponse>();
    internal static IEnumerable<GetUserExpertiseResponse> FromUserContactEntity(this Data.User data)
    => data.Contacts.BuildAdapter().AdaptToType<IEnumerable<GetUserExpertiseResponse>>();
    internal static Data.User ToEntity(this CreateUserRequest request) => request.BuildAdapter().AdaptToType<Data.User>();
    internal static Data.User ToEntity(this UpdateUserRequest request, Data.User entity) => request.BuildAdapter().AdaptTo(entity);
    internal static Data.UserExpertise ToEntity(this CreateUserExpertiseRequest request) => request.BuildAdapter().AdaptToType<Data.UserExpertise>();
    internal static Data.UserExpertise ToEntity(this UpdateUserExpertiseRequest request, Data.UserExpertise entity) => request.BuildAdapter().AdaptTo(entity);

    static UserMapper()
    {
        TypeAdapterConfig<Data.User, GetUserResponse>.NewConfig();
        TypeAdapterConfig<Data.UserExpertise, GetUserExpertiseResponse>.NewConfig();
        TypeAdapterConfig<Data.UserContact, GetUserContactResponse>.NewConfig();
        TypeAdapterConfig<CreateUserRequest, Data.User>.NewConfig();
        TypeAdapterConfig<UpdateUserRequest, Data.User>.NewConfig();
        TypeAdapterConfig<CreateUserExpertiseRequest, Data.UserExpertise>.NewConfig()
        .AfterMapping(s => s.ID = s.GenerateNewID().ToString()!);
        TypeAdapterConfig<UpdateUserExpertiseRequest, Data.UserExpertise>.NewConfig();
    }
}
