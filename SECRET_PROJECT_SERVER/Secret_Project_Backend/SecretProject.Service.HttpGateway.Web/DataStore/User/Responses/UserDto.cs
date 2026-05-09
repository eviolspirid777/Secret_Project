namespace SecretProject.Service.HttpGateway.Web.DataStore.User.Responses;

public class UserDto
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public SoundConnectionStateDto States { get; set; } = new();
}

public class SoundConnectionStateDto
{
    public bool IsMicrophoneMuted { get; set; }
    public bool IsHeadphonesMuted { get; set; }
}
