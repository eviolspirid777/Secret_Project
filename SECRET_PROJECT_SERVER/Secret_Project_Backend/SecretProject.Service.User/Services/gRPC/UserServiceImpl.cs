using ContractsGrpc = SecretProject.Data.Contracts.User;
using SecretProject.Service.User.Abstractions;
using Microsoft.AspNetCore.Mvc;
using SecretProject.Data.Contracts.User;
using Grpc.Core;
using System.Runtime.InteropServices;

namespace SecretProject.Service.User.Services.gRPC
{
    public class UserServiceImpl(IUserService userService) : ContractsGrpc.UserService.UserServiceBase
    {
        private readonly IUserService _userService = userService;
        public override async Task<GetUserInformationResponse> GetUserInformation(GetUserInformationRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.Id, out var guidId))
                throw new ArgumentException("Не удалось распарсить string id в Guid");

            return await _userService.GetUserInformation(guidId);
        }

        public override async Task<ChangeUserStatusResponse> ChangeUserStatus(ChangeUserStatusRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.UserId, out var guidId))
                throw new ArgumentException("Не удалось распарсить string id в Guid");
            if(string.IsNullOrEmpty(request.Status))
                throw new ArgumentException("Пустая строка статуса");

            return await _userService.ChangeUserStatus(guidId, request.Status);
        }

        public override async Task<GetFriendRequestsResponse> GetFriendRequests(GetFriendRequestsRequest request, ServerCallContext context)
        {
            if(!Guid.TryParse(request.UserId, out var guidId))
                throw new ArgumentException("Не удалось распарсить string id в Guid");

            return await _userService.GetFriendRequests(guidId);
        }

        public override async Task<GetFriendsResponse> GetFriends(GetFriendsRequest request, ServerCallContext context)
        {
            if (!Guid.TryParse(request.Id, out var guidId))
                throw new ArgumentException("Не удалось распарсить string id в Guid");

            return await _userService.GetFriends(guidId);
        }
    }
}
