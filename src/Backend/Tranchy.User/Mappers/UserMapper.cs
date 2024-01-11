using Mapster;
using Tranchy.User.Data;
using Tranchy.User.Requests;
using Tranchy.User.Responses;

namespace Tranchy.User.Mappers;

internal static class UserMapper
{
    static UserMapper()
    {
        TypeAdapterConfig<Data.User, GetUserResponse>.NewConfig();
        TypeAdapterConfig<UserExpertise, GetUserExpertiseResponse>.NewConfig();
        TypeAdapterConfig<UserContact, GetUserContactResponse>.NewConfig();
        TypeAdapterConfig<CreateUserRequest, Data.User>.NewConfig();
        TypeAdapterConfig<UpdateUserRequest, Data.User>.NewConfig();
        TypeAdapterConfig<CreateUserExpertiseRequest, UserExpertise>.NewConfig()
            .AfterMapping(s => s.ID = s.GenerateNewID().ToString()!);
        TypeAdapterConfig<UpdateUserExpertiseRequest, UserExpertise>.NewConfig();
    }

    internal static GetUserResponse FromEntity(this Data.User data) =>
        data.BuildAdapter().AdaptToType<GetUserResponse>();

    internal static IEnumerable<GetUserExpertiseResponse> FromUserExpertiseEntity(this Data.User data)
        => data.Expertises.BuildAdapter().AdaptToType<IEnumerable<GetUserExpertiseResponse>>();

    internal static GetUserExpertiseResponse FromUserExpertiseEntity(this UserExpertise data)
        => data.BuildAdapter().AdaptToType<GetUserExpertiseResponse>();

    internal static IEnumerable<GetUserExpertiseResponse> FromUserContactEntity(this Data.User data)
        => data.Contacts.BuildAdapter().AdaptToType<IEnumerable<GetUserExpertiseResponse>>();

    internal static Data.User ToEntity(this CreateUserRequest request) =>
        request.BuildAdapter().AdaptToType<Data.User>();

    internal static Data.User ToEntity(this UpdateUserRequest request, Data.User entity) =>
        request.BuildAdapter().AdaptTo(entity);

    internal static UserExpertise ToEntity(this CreateUserExpertiseRequest request) =>
        request.BuildAdapter().AdaptToType<UserExpertise>();

    internal static UserExpertise ToEntity(this UpdateUserExpertiseRequest request, UserExpertise entity) =>
        request.BuildAdapter().AdaptTo(entity);
}
