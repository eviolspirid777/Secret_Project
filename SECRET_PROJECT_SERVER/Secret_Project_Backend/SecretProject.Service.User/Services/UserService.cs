using Microsoft.EntityFrameworkCore;
using SecretProject.Data.Contracts.User;
using SecretProject.Service.User.Abstractions;
using SecretProject.Service.User.Storage.Mappers;
using SecretProject.User.Data.DataStore.Context;
using SecretProject.User.Data.DataStore.Entities;

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

        public async Task<GetUserInformationResponse> GetUserInformation(Guid id)
        {
            var user = await _dbContext.UserProfiles.FirstOrDefaultAsync(x => x.Id == id);
            if (user is null)
                throw new InvalidOperationException($"Не удалось найти пользователя с таким идентификатором {id}");

            return user.ToGrpc();
        }

    }
}
