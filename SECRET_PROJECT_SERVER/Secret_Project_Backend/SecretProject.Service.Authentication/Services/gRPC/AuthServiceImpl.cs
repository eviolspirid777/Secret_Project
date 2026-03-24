using Grpc.Core;
using Microsoft.EntityFrameworkCore;
using SecretProject.Authentication.Data.DataStore.Context;
using SecretProject.Authentication.Data.DataStore.Entities;
using SecretProject.Service.Authentication.Storage.Mappers;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Authentication.Services.gRPC
{
    public class AuthServiceImpl(AuthDbContext dbContext) : AuthService.AuthServiceBase
    {
        private readonly AuthDbContext _dbContext = dbContext;

        public override async Task<RegisterResponse> Register(RegisterRequest request, ServerCallContext context)
        {
            Console.WriteLine("Зашли в метод регистрации по grpc");
            return new() { };
            //return base.Register(request, context);
        }

        public override Task<LoginResponse> Login(LoginRequest request, ServerCallContext context)
        {
            Console.WriteLine("Зашли в метод логина по grpc");

            return base.Login(request, context);
        }

        public override Task<LogoutResponse> Logout(LogoutRequest request, ServerCallContext context)
        {
            Console.WriteLine("Зашли в метод логаута по grpc");
            return base.Logout(request, context);
        }


        public override async Task<GetUsersByIdsResponse> GetUsersByIds(GetUsersByIdsRequest request, ServerCallContext context)
        {
            if (request.Id == null || request.Id.Count == 0)
            {
                return new GetUsersByIdsResponse();
            }

            var ids = request.Id.ToList();

            var users = await _dbContext.Set<AuthUser>()
                .Where(u => ids.Contains(u.Id))
                .ToListAsync();

            var mappedUsers = users.Select(UserMapper.ToGrpc);
            var response = new GetUsersByIdsResponse();
            response.Users.AddRange(mappedUsers);

            return response;
        }
    }
}
