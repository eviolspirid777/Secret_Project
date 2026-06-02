namespace SecretProject.Service.User.Exceptions;

public sealed class InvalidUserStatusException(string status)
    : Exception($"Пришел неправильный статус пользователя: {status}")
{
    public string Status { get; } = status;
}
