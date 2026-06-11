using SecretProject.Data.Contracts.User;

namespace SecretProject.Service.User.Abstractions
{
    public interface IUserService
    {
        Task<GetUserInformationResponse> GetUserInformation(Guid id);
        Task<ChangeUserStatusResponse> ChangeUserStatus(Guid id, string status);
        Task<GetFriendRequestsResponse> GetFriendRequests(Guid id);
        Task<GetFriendsResponse> GetFriends(Guid id);
        Task<ChangeUserInformationResponse> ChangeUserInformation(Guid id, byte[] avatar, string username);
        Task<ChangeHeadphonesStateResponse> ChangeHeadphonesState(Guid id);
        Task<ChangeMicrophoneStateResponse> ChangeMicrophoneState(Guid id);
        Task<SendFriendRequestResponse> SendFriendRequest(Guid fromId, Guid toId);
        Task<AcceptFriendRequestResponse> AcceptFriendRequest(Guid fromId, Guid toId);
        Task<DeclineFriendRequestResponse> DeclineFriendRequest(Guid fromId, Guid toId);
        Task<DeleteFriendRequestResponse> DeleteFriend(Guid fromId, Guid toId);
    }
}
