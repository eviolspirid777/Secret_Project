using SecretProject.Platform.Data.DTOs.User;
using SecretProject.Platform.Data.Models;

namespace SecretProject.Platform.Data.DTOs;
public class FriendshipDto
{
    public string Id { get; set; }
    public UserDTO User { get; set; }
    public UserDTO Friend { get; set; }
    public FriendshipStatus Status { get; set; }
}
