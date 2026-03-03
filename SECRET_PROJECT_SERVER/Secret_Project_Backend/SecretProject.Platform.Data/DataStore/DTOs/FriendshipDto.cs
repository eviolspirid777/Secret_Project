using SecretProject.Platform.Data.DataStore.DTOs.User;
using SecretProject.Platform.Data.DataStore.Models;

namespace SecretProject.Platform.Data.DataStore.DTOs;
public class FriendshipDto
{
    public string Id { get; set; }
    public UserDTO User { get; set; }
    public UserDTO Friend { get; set; }
    public FriendshipStatus Status { get; set; }
}
