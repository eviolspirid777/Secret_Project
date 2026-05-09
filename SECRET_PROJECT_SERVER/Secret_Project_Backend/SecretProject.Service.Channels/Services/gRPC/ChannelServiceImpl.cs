using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using SecretProject.Channels.Data.DataStore.Context;
using SecretProject.Channels.Data.DataStore.Entities;
using SecretProject.Channels.Data.DataStore.Models;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Channels.Services.gRPC
{
    public class ChannelServiceImpl(
        ChannelDbContext dbContext,
        AuthService.AuthServiceClient authServiceClient) : ChannelService.ChannelServiceBase
    {
        private readonly ChannelDbContext _dbContext = dbContext;
        private readonly AuthService.AuthServiceClient _authServiceClient = authServiceClient;

        public override async Task<GetChannelInformationResponse> GetChannelInformation(GetChannelInformationRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.ChannelId, out var channelId))
            {
                return Error<GetChannelInformationResponse>("Invalid ChannelId");
            }

            var channel = await _dbContext.Channels.AsNoTracking().FirstOrDefaultAsync(c => c.Id == channelId, context.CancellationToken);
            if (channel == null)
            {
                return Error<GetChannelInformationResponse>("Канал не найден");
            }

            return new GetChannelInformationResponse
            {
                Success = true,
                Channel = ToView(channel)
            };
        }

        public override async Task<CreateChannelResponse> CreateChannel(CreateChannelRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.AdminUserId, out var adminUserId))
            {
                return new CreateChannelResponse
                {
                    Success = false,
                    ErrorMessage = "Некорректный идентификатор администратора"
                };
            }

            var userExists = await UserExists(request.AdminUserId, context.CancellationToken);
            if (!userExists)
            {
                return new CreateChannelResponse
                {
                    Success = false,
                    ErrorMessage = "Пользователь не найден"
                };
            }

            var channel = new Channel
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                ChannelAvatarUrl = string.IsNullOrWhiteSpace(request.ChannelAvatarUrl) ? null : request.ChannelAvatarUrl,
                CreatedAt = DateTime.UtcNow,
                AdminId = adminUserId,
                ChannelUsers =
                [
                    new ChannelUser
                    {
                        UserId = adminUserId,
                        ChannelId = Guid.Empty,
                        Role = ChannelRole.Admin
                    }
                ]
            };

            channel.ChannelUsers.First().ChannelId = channel.Id;

            await _dbContext.Channels.AddAsync(channel, context.CancellationToken);
            await _dbContext.SaveChangesAsync(context.CancellationToken);

            return new CreateChannelResponse
            {
                Success = true,
                ChannelId = channel.Id.ToString()
            };
        }

        public override async Task<ChannelOperationResponse> JoinChannel(JoinChannelRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.ChannelId, out var channelId))
            {
                return Error<ChannelOperationResponse>("Invalid ChannelId");
            }

            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return Error<ChannelOperationResponse>("Некорректный идентификатор пользователя");
            }

            var channel = await _dbContext.Channels
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == channelId, context.CancellationToken);

            if (channel == null)
            {
                return Error<ChannelOperationResponse>("Invalid ChannelId");
            }

            if (!await UserExists(request.UserId, context.CancellationToken))
            {
                return Error<ChannelOperationResponse>("Пользователь не найден");
            }

            channel.ChannelUsers ??= [];
            if (channel.ChannelUsers.Any(cu => cu.UserId == userId))
            {
                return Error<ChannelOperationResponse>("Пользователь уже состоит в данном канале");
            }

            channel.ChannelUsers.Add(new ChannelUser
            {
                UserId = userId,
                ChannelId = channelId,
                Role = ChannelRole.Member
            });

            await _dbContext.SaveChangesAsync(context.CancellationToken);
            return Success();
        }

        public override async Task<DeleteChannelResponse> DeleteChannel(DeleteChannelRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.ChannelId, out var channelId))
            {
                return new DeleteChannelResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid Id"
                };
            }

            var channel = await _dbContext.Channels.FindAsync([channelId], context.CancellationToken);
            if (channel == null)
            {
                return new DeleteChannelResponse
                {
                    Success = false,
                    ErrorMessage = "Invalid Id"
                };
            }

            _dbContext.Channels.Remove(channel);
            await _dbContext.SaveChangesAsync(context.CancellationToken);

            return new DeleteChannelResponse
            {
                Success = true,
                ChannelId = channel.Id.ToString()
            };
        }

        public override async Task<GetUserChannelsResponse> GetUserChannels(GetUserChannelsRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return Error<GetUserChannelsResponse>("Некорректный идентификатор пользователя");
            }

            if (!await UserExists(request.UserId, context.CancellationToken))
            {
                return Error<GetUserChannelsResponse>("Пользователь не найден");
            }

            var channels = await _dbContext.Channels
                .AsNoTracking()
                .Where(ch => ch.ChannelUsers != null && ch.ChannelUsers.Any(chu => chu.UserId == userId))
                .ToListAsync(context.CancellationToken);

            var response = new GetUserChannelsResponse
            {
                Success = true
            };

            foreach (var channel in channels)
            {
                response.Channels[channel.Id.ToString()] = ToView(channel);
            }

            return response;
        }

        public override async Task<GetChannelUsersResponse> GetChannelUsers(GetChannelUsersRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.ChannelId, out var channelId))
            {
                return Error<GetChannelUsersResponse>("Некорректный идентификатор канала");
            }

            var channel = await _dbContext.Channels
                .AsNoTracking()
                .Include(c => c.ChannelUsers)
                .FirstOrDefaultAsync(c => c.Id == channelId, context.CancellationToken);

            if (channel == null)
            {
                return Error<GetChannelUsersResponse>("Канал не найден");
            }

            var response = new GetChannelUsersResponse
            {
                Success = true
            };

            if (channel.ChannelUsers == null || channel.ChannelUsers.Count == 0)
            {
                return response;
            }

            var usersResponse = await _authServiceClient.GetUsersByIdsAsync(
                new GetUsersByIdsRequest
                {
                    Id = { channel.ChannelUsers.Select(cu => cu.UserId.ToString()) }
                },
                cancellationToken: context.CancellationToken);

            response.Users.AddRange(usersResponse.Users.Select(user => new ChannelUserView
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Avatar = user.Avatar,
                Status = user.Status,
                IsMicroMuted = user.SoundState?.IsMicroMuted ?? false,
                IsHeadphonesMuted = user.SoundState?.IsHeadphonesMuted ?? false
            }));
            return response;
        }

        public override async Task<ChannelOperationResponse> AddUserToChannel(AddUserToChannelRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.ChannelId, out var channelId))
            {
                return Error<ChannelOperationResponse>("Некорректный идентификатор канала");
            }

            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return Error<ChannelOperationResponse>("Некорректный идентификатор пользователя");
            }

            var channelExists = await _dbContext.Channels.AnyAsync(c => c.Id == channelId, context.CancellationToken);
            if (!channelExists || !await UserExists(request.UserId, context.CancellationToken))
            {
                return Error<ChannelOperationResponse>("Пользователя или канала с таким идентификатором не существует");
            }

            var userAlreadyJoined = await _dbContext.ChannelUsers.AnyAsync(
                cu => cu.UserId == userId && cu.ChannelId == channelId,
                context.CancellationToken);

            if (userAlreadyJoined)
            {
                return Error<ChannelOperationResponse>("Пользователь уже состоит в данном канале");
            }

            await _dbContext.ChannelUsers.AddAsync(new ChannelUser
            {
                ChannelId = channelId,
                UserId = userId,
                Role = ChannelRole.Member
            }, context.CancellationToken);

            await _dbContext.SaveChangesAsync(context.CancellationToken);
            return Success();
        }

        public override async Task<ChannelOperationResponse> DeleteUserFromChannel(DeleteUserFromChannelRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.ChannelId, out var channelId))
            {
                return Error<ChannelOperationResponse>("Некорректный идентификатор канала");
            }

            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return Error<ChannelOperationResponse>("Некорректный идентификатор пользователя");
            }

            var channelUser = await _dbContext.ChannelUsers
                .FirstOrDefaultAsync(cu => cu.ChannelId == channelId && cu.UserId == userId, context.CancellationToken);

            if (channelUser == null)
            {
                return Error<ChannelOperationResponse>("Пользователь не найден в канале");
            }

            _dbContext.ChannelUsers.Remove(channelUser);
            await _dbContext.SaveChangesAsync(context.CancellationToken);

            return Success();
        }

        private async Task<bool> UserExists(string userId, CancellationToken cancellationToken)
        {
            var response = await _authServiceClient.GetUsersByIdsAsync(
                new GetUsersByIdsRequest { Id = { userId } },
                cancellationToken: cancellationToken);

            return response.Users.Count > 0;
        }

        private static ChannelView ToView(Channel channel)
        {
            return new ChannelView
            {
                Id = channel.Id.ToString(),
                Name = channel.Name,
                ChannelAvatarUrl = channel.ChannelAvatarUrl ?? string.Empty,
                CreatedAtUtc = channel.CreatedAt.ToString("O")
            };
        }

        private static ChannelOperationResponse Success()
        {
            return new ChannelOperationResponse { Success = true };
        }

        private static T Error<T>(string errorMessage) where T : class, new()
        {
            return typeof(T).Name switch
            {
                nameof(GetChannelInformationResponse) => new GetChannelInformationResponse
                {
                    Success = false,
                    ErrorMessage = errorMessage
                } as T ?? new T(),
                nameof(GetUserChannelsResponse) => new GetUserChannelsResponse
                {
                    Success = false,
                    ErrorMessage = errorMessage
                } as T ?? new T(),
                nameof(GetChannelUsersResponse) => new GetChannelUsersResponse
                {
                    Success = false,
                    ErrorMessage = errorMessage
                } as T ?? new T(),
                nameof(ChannelOperationResponse) => new ChannelOperationResponse
                {
                    Success = false,
                    ErrorMessage = errorMessage
                } as T ?? new T(),
                _ => new T()
            };
        }
    }
}
