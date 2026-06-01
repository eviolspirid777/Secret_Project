using Grpc.Core;
using SecretProject.Data.Contracts.Email;
using SecretProject.Service.Email.DataStore.Abstractions;

namespace SecretProject.Service.Email.Services.gRPC
{
    public class EmailServiceImpl(IEmailService emailService) : EmailService.EmailServiceBase
    {
        private readonly IEmailService _emailService = emailService;

        public override async Task<SendEmailConfirmationResponse> SendEmailConfirmation(SendEmailConfirmationRequest request, ServerCallContext context)
        {
            await _emailService.SendEmailConfirmationAsync(request.Email, request.UserId, request.Token);
            return new();
        }
    }
}
