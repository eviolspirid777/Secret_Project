using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using SecretProject.Data.Contracts.User;
using SecretProject.Service.User.Abstractions;
using SecretProject.Service.User.Storage.Mappers;
using SecretProject.User.Data.DataStore.Context;
using SecretProject.User.Data.DataStore.Entities;
using System.Net;

namespace SecretProject.Service.User.Services
{
    public sealed class UserService(UserDbContext dbContext, ILogger<UserService> logger) : IUserService
    {
        private readonly UserDbContext _dbContext = dbContext;
        private readonly ILogger<UserService> _logger = logger;

        public async Task<ChangeUserStatusResponse> ChangeUserStatus(Guid id, string status)
        {
            var user = await _dbContext.UserProfiles.FirstOrDefaultAsync(x => x.Id == id);
            if (user is null)
            {
                return new ChangeUserStatusResponse
                {
                    Status = false
                };
            }

            if (!Enum.TryParse<PresenceState>(status, ignoreCase: true, out var presenceState))
            {
                return new ChangeUserStatusResponse
                {
                    Status = false
                };
            }

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

            var friends = await FindFriends(id);
            if(friends.Count == 0)
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

        private async Task<List<UserProfile>> FindFriends(Guid userId)
        {
            var friends = new List<UserProfile>();
            var friendsId = _dbContext.Friendships.Where(x => x.UserId == userId).Select(x => x.FriendId).ToList();
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
                throw new InvalidOperationException($"Не удалось найти пользователя с таким идентификатором {id}");

            return user;
        }
    }
}
