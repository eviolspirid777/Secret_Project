using Grpc.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using SecretProject.Authentication.Data.DataStore.Context;
using SecretProject.Authentication.Data.DataStore.Entities;
using SecretProject.Service.Authentication.Configuration;
using SecretProject.Service.Authentication.Storage.Contracts.Events;
using SecretProject.Service.Authentication.Storage.Mappers;
using SecretProject.Service.Grpc.v1.Proto;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;

namespace SecretProject.Service.Authentication.Services.gRPC
{
    public class AuthServiceImpl(
        AuthDbContext authDbContext,
        UserManager<AuthUser> userManager,
        SignInManager<AuthUser> signInManager,
        IOptions<JwtOptions> jwtOptions,
        EmailService.EmailServiceClient emailServiceClient) : AuthService.AuthServiceBase
    {
        private readonly AuthDbContext _authDbContext = authDbContext;
        private readonly UserManager<AuthUser> _userManager = userManager;
        private readonly SignInManager<AuthUser> _signInManager = signInManager;
        private readonly JwtOptions _jwtOptions = jwtOptions.Value;
        private readonly EmailService.EmailServiceClient _emailServiceClient = emailServiceClient;

        public override async Task<RegisterResponse> Register(RegisterRequest request, ServerCallContext context)
        {
            var foundedUser = await _userManager.FindByEmailAsync(request.Email);
            if (foundedUser != null)
            {
                return new RegisterResponse
                {
                    Success = false,
                    ErrorMessage = "Пользователь с такой почтой уже существует"
                };
            }

            var user = new AuthUser
            {
                UserName = request.Email,
                Email = request.Email,
                DisplayName = string.IsNullOrWhiteSpace(request.DisplayName) ? request.Email : request.DisplayName,
                EmailConfirmed = false
            };

            await using IDbContextTransaction transaction = await _authDbContext.Database.BeginTransactionAsync(context.CancellationToken);

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return new RegisterResponse
                {
                    Success = false,
                    ErrorMessage = string.Join("; ", result.Errors.Select(e => e.Description))
                };
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            try
            {
                await _emailServiceClient.SendEmailConfirmationAsync(new()
                    {
                        Email = user.Email ?? string.Empty,
                        UserId = user.Id.ToString(),
                        Token = token
                    },
                    cancellationToken: context.CancellationToken);

                var integrationEvent = new IntegrationEventEnvelope<UserRegisteredEvent>
                {
                    EventId = Guid.NewGuid(),
                    EventType = EventTypes.UserRegistered,
                    OccurredAtUtc = DateTime.UtcNow,
                    Version = 1,
                    Payload = new UserRegisteredEvent
                    {
                        UserId = user.Id,
                        Email = user.Email ?? string.Empty,
                        DisplayName = user.DisplayName
                    }
                };

                _authDbContext.OutboxMessages.Add(new OutboxMessage
                {
                    Id = integrationEvent.EventId,
                    Type = integrationEvent.EventType,
                    Payload = JsonSerializer.Serialize(integrationEvent),
                    OccurredAtUtc = integrationEvent.OccurredAtUtc
                });

                await _authDbContext.SaveChangesAsync(context.CancellationToken);
                await transaction.CommitAsync(context.CancellationToken);

                return new RegisterResponse
                {
                    Success = true,
                    UserId = user.Id.ToString(),
                    Message = "Для завершения регистрации проверьте вашу почту и подтвердите учётную запись",
                    EmailConfirmationRequired = true
                };
            }
            catch
            {
                await transaction.RollbackAsync(context.CancellationToken);

                return new RegisterResponse
                {
                    Success = false,
                    ErrorMessage = "Ошибка при отправке письма подтверждения. Пожалуйста, попробуйте позже."
                };
            }
        }

        public override async Task<ConfirmEmailResponse> ConfirmEmail(ConfirmEmailRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new ConfirmEmailResponse
                {
                    Success = false,
                    ErrorMessage = "Пользователь не найден!"
                };
            }

            var result = await _userManager.ConfirmEmailAsync(user, request.Token);
            if (!result.Succeeded)
            {
                return new ConfirmEmailResponse
                {
                    Success = false,
                    ErrorMessage = "Ошибка при подтверждении email"
                };
            }

            return new ConfirmEmailResponse
            {
                Success = true,
                UserId = user.Id.ToString(),
                Message = "Email подтвержден!"
            };
        }

        public override async Task<LoginResponse> Login(LoginRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return new LoginResponse
                {
                    Success = false,
                    ErrorMessage = "Неверные данные для входа"
                };
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return new LoginResponse
                {
                    Success = false,
                    ErrorMessage = "Email не подтвержден. Пожалуйста, подтвердите email для входа."
                };
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                return new LoginResponse
                {
                    Success = false,
                    ErrorMessage = "Неверные учетные данные"
                };
            }

            var (token, expirationDate) = GenerateJwtToken(user);

            return new LoginResponse
            {
                Success = true,
                UserId = user.Id.ToString(),
                DisplayName = user.DisplayName,
                AccessToken = token,
                ExpiresIn = new DateTimeOffset(expirationDate).ToUnixTimeSeconds()
            };
        }

        public override async Task<LogoutResponse> Logout(LogoutRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new LogoutResponse
                {
                    Success = false,
                    Message = "Пользователь не найден!"
                };
            }

            await _signInManager.SignOutAsync();
            return new LogoutResponse
            {
                Success = true,
                Message = "Выход выполнен"
            };
        }

        public override async Task<DeleteAccountResponse> DeleteAccount(DeleteAccountRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return new DeleteAccountResponse
                {
                    Success = false,
                    ErrorMessage = "Пользователь не найден!"
                };
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return new DeleteAccountResponse
                {
                    Success = false,
                    ErrorMessage = string.Join("; ", result.Errors.Select(e => e.Description))
                };
            }

            return new DeleteAccountResponse
            {
                Success = true,
                Message = "Аккаунт удален"
            };
        }

        public override async Task<GetUsersByIdsResponse> GetUsersByIds(GetUsersByIdsRequest request, ServerCallContext context)
        {
            if (request.Id == null || request.Id.Count == 0)
            {
                return new GetUsersByIdsResponse();
            }

            var response = new GetUsersByIdsResponse();

            foreach (var id in request.Id.Distinct())
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user != null)
                {
                    response.Users.Add(UserMapper.ToGrpc(user));
                }
            }

            return response;
        }

        private (string token, DateTime expirationDate) GenerateJwtToken(AuthUser user)
        {
            var expirationDate = DateTime.UtcNow.AddDays(1);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                expires: expirationDate,
                signingCredentials: credentials);

            return (new JwtSecurityTokenHandler().WriteToken(token), expirationDate);
        }
    }
}
