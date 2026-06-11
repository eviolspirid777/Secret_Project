using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using SecretProject.Data.Contracts.User;
using SecretProject.Service.User.Abstractions;
using SecretProject.Service.User.Exceptions;
using SecretProject.Service.User.Storage.Mappers;
using SecretProject.User.Data.DataStore.Context;
using SecretProject.User.Data.DataStore.Entities;

namespace SecretProject.Service.User.Services
{
    public sealed class UserService(UserDbContext dbContext, ILogger<UserService> logger) : IUserService
    {
        private readonly UserDbContext _dbContext = dbContext;
        private readonly ILogger<UserService> _logger = logger;

        #region User
        public async Task<ChangeUserStatusResponse> ChangeUserStatus(Guid id, string status)
        {
            var user = await GetUserOrThrow(id);

            if (!Enum.TryParse<PresenceState>(status, ignoreCase: true, out var presenceState))
                throw new InvalidUserStatusException(status);

            user.PresenceState = presenceState;
            user.UpdatedAt = DateTimeOffset.UtcNow;

            await _dbContext.SaveChangesAsync();

            return new ChangeUserStatusResponse
            {
                Status = true
            };
        }

        public async Task<GetFriendRequestsResponse> GetFriendRequests(Guid id)
        {
            var user = await GetUserOrThrow(id);

            var friends = await FindFriendRequests(id);
            if (friends.Count == 0)
                return new() { Users = { new Google.Protobuf.Collections.RepeatedField<UserDto>() } };

            return new() { Users = { friends.ToGrpc().Users } };
        }

        public async Task<GetFriendsResponse> GetFriends(Guid id)
        {
            var user = await GetUserOrThrow(id);
            var friends = await FindFriends(id);

            return new() { Users = { friends.Select(x => x.ToGrpcPublic()) } };
        }

        public async Task<GetUserInformationResponse> GetUserInformation(Guid id)
        {
            var user = await GetUserOrThrow(id);

            return user.ToGrpc();
        }
        //TODO определиться как хранить и работать с аватаром
        public async Task<ChangeUserInformationResponse> ChangeUserInformation(Guid id, byte[] avatar, string username)
        {
            var user = await GetUserOrThrow(id);
            user.Name = username;

            await _dbContext.SaveChangesAsync();

            return new();
        }

        public async Task<ChangeHeadphonesStateResponse> ChangeHeadphonesState(Guid id)
        {
            var user = await GetUserOrThrow(id);
            user.IsHeadphonesMuted = !user.IsHeadphonesMuted;

            await _dbContext.SaveChangesAsync();
            return new() { IsHeadphonesMuted = user.IsHeadphonesMuted };
        }

        public async Task<ChangeMicrophoneStateResponse> ChangeMicrophoneState(Guid id)
        {
            var user = await GetUserOrThrow(id);
            user.IsMicrophoneMuted = !user.IsMicrophoneMuted;

            await _dbContext.SaveChangesAsync();

            return new() { IsMicrophoneMuted = user.IsMicrophoneMuted};
        }
        #endregion

        #region Friendship
        public async Task<SendFriendRequestResponse> SendFriendRequest(Guid fromId, Guid toId)
        {
            var fromUser = await GetUserOrThrow(fromId);
            var toUser = await GetUserOrThrow(toId);

            var friendshipRequestExist = await _dbContext.Friendships.AnyAsync(x => x.UserId == fromId && x.FriendId == toId ||
                                            x.UserId == toId && x.FriendId == fromId);
            if (friendshipRequestExist)
            {
                throw new InvalidOperationException("Запрос дружбы уже существует");
            }

            await _dbContext.Friendships.AddAsync(new()
            {
                Id = Guid.NewGuid(),
                UserId = fromId,
                FriendId = toId,
                Status = FriendshipStatus.Pending
            });

            await _dbContext.SaveChangesAsync();

            return new();
        }

        public async Task<AcceptFriendRequestResponse> AcceptFriendRequest(Guid fromId, Guid toId)
        {
            var fromUser = await GetUserOrThrow(fromId);
            var toUser = await GetUserOrThrow(toId);

            var friendshipRequest = await _dbContext.Friendships.FirstOrDefaultAsync(x => x.UserId == fromId && x.FriendId == toId ||
                                            x.UserId == toId && x.FriendId == fromId);
            if (friendshipRequest is null)
            {
                throw new InvalidOperationException("Запроса дружбы не существует");
            }

            friendshipRequest.Status = FriendshipStatus.Accepted;

            await _dbContext.SaveChangesAsync();

            return new();
        }

        public async Task<DeclineFriendRequestResponse> DeclineFriendRequest(Guid fromId, Guid toId)
        {
            var fromUser = await GetUserOrThrow(fromId);
            var toUser = await GetUserOrThrow(toId);

            var friendshipRequest = await _dbContext.Friendships.FirstOrDefaultAsync(x => x.UserId == fromId && x.FriendId == toId ||
                                            x.UserId == toId && x.FriendId == fromId);
            if (friendshipRequest is null)
            {
                throw new InvalidOperationException("Запроса дружбы не существует");
            }

            friendshipRequest.Status = FriendshipStatus.Blocked;

            await _dbContext.SaveChangesAsync();

            return new();
        }

        public async Task<DeleteFriendRequestResponse> DeleteFriend(Guid fromId, Guid toId)
        {
            await GetUserOrThrow(fromId);
            await GetUserOrThrow(toId);

            var deletedCount = await _dbContext.Friendships
                .Where(x =>
                    (x.UserId == fromId && x.FriendId == toId) ||
                    (x.UserId == toId && x.FriendId == fromId))
                .ExecuteDeleteAsync();

            if (deletedCount == 0)
            {
                throw new InvalidOperationException("Запроса дружбы не существует");
            }

            return new();
        }

        #endregion

        #region Private
        private async Task<List<UserProfile>> FindFriendRequests(Guid userId)
        {
            var friends = new List<UserProfile>();
            var friendsId = _dbContext.Friendships.Where(x => x.FriendId == userId && x.Status == FriendshipStatus.Pending).Select(x => x.UserId).ToList();
            foreach (var friendId in friendsId)
            {
                var friend = await GetUserOrThrow(friendId);
                friends.Add(friend);
            }

            return friends;
        }

        private async Task<List<UserProfile>> FindFriends(Guid userId)
        {
            var friends = new List<UserProfile>();
            var friendsId = _dbContext.Friendships.Where(x => (x.UserId == userId || x.FriendId == userId) && x.Status == FriendshipStatus.Accepted).Select(x => x.FriendId).ToList();
            foreach (var friendId in friendsId)
            {
                var friend = await GetUserOrThrow(friendId);
                friends.Add(friend);
            }

            return friends;
        }

        private async Task<UserProfile> GetUserOrThrow(Guid id)
        {
            var user = await _dbContext.UserProfiles.FirstOrDefaultAsync(x => x.Id == id);
            if (user is null)
                throw new UserNotFoundException(id);

            return user;
        }
        #endregion
    }
}
