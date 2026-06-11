using ContractsGrpc = SecretProject.Data.Contracts.User;
using SecretProject.Service.User.Abstractions;
using SecretProject.Data.Contracts.User;
using Grpc.Core;
using SecretProject.Service.User.Exceptions;

namespace SecretProject.Service.User.Services.gRPC
{
    public class UserServiceImpl(IUserService userService) : ContractsGrpc.UserService.UserServiceBase
    {
        private readonly IUserService _userService = userService;

        #region User
        public override async Task<GetUserInformationResponse> GetUserInformation(GetUserInformationRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.Id, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.GetUserInformation(guidId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<ChangeUserStatusResponse> ChangeUserStatus(ChangeUserStatusRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.UserId, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));
            if (string.IsNullOrEmpty(request.Status))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Пустая строка статуса"));

            try
            {
                return await _userService.ChangeUserStatus(guidId, request.Status);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
            catch (InvalidUserStatusException ex)
            {
                throw new RpcException(new Status(StatusCode.InvalidArgument, ex.Message));
            }
        }

        public override async Task<GetFriendRequestsResponse> GetFriendRequests(GetFriendRequestsRequest request, ServerCallContext context)
        {
            if(!Guid.TryParse(request.UserId, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.GetFriendRequests(guidId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<GetFriendsResponse> GetFriends(GetFriendsRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.Id, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.GetFriends(guidId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<ChangeUserInformationResponse> ChangeUserInformation(ChangeUserInformationRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.UserId, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.ChangeUserInformation(guidId, request.Avatar.ToByteArray(), request.Name);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<ChangeMicrophoneStateResponse> ChangeMicrophoneState(ChangeMicrophoneStateRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.Id, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.ChangeMicrophoneState(guidId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<ChangeHeadphonesStateResponse> ChangeHeadphonesState(ChangeHeadphonesStateRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.Id, out var guidId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.ChangeHeadphonesState(guidId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }
        #endregion

        #region Friendship
        public override async Task<SendFriendRequestResponse> SendFriendRequest(SendFriendRequestRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.FromUserId, out var fromId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));
            
            if (!Guid.TryParse(request.ToUserId, out var toId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.SendFriendRequest(fromId, toId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<AcceptFriendRequestResponse> AcceptFriendRequest(AcceptFriendRequestRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.FromUserId, out var fromId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            if (!Guid.TryParse(request.ToUserId, out var toId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.AcceptFriendRequest(fromId, toId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<DeclineFriendRequestResponse> DeclineFriendRequest(DeclineFriendRequestRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.FromUserId, out var fromId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            if (!Guid.TryParse(request.ToUserId, out var toId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.DeclineFriendRequest(fromId, toId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        public override async Task<DeleteFriendRequestResponse> DeleteFriendRequest(DeleteFriendRequestRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.FromUserId, out var fromId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            if (!Guid.TryParse(request.ToUserId, out var toId))
                throw new RpcException(new Status(StatusCode.InvalidArgument, "Не удалось распарсить string id в Guid"));

            try
            {
                return await _userService.DeleteFriend(fromId, toId);
            }
            catch (UserNotFoundException ex)
            {
                throw new RpcException(new Status(StatusCode.NotFound, ex.Message));
            }
        }

        #endregion
    }
}
