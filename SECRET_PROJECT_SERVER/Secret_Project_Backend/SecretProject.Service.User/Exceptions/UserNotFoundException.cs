namespace SecretProject.Service.User.Exceptions;

public sealed class UserNotFoundException(Guid userId)
    : Exception($"Пользователь с таким идентификатором не найден: {userId}")
{
    public Guid UserId { get; } = userId;
}
