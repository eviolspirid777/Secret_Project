using Grpc.Core;
using SecretProject.Service.Grpc.v1.Proto;

namespace SecretProject.Service.Authentication.Services.gRPC
{
    public class AuthServiceImpl() : AuthService.AuthServiceBase
    {
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
    }
}
