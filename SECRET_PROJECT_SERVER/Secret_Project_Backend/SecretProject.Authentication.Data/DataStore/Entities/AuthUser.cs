using Microsoft.AspNetCore.Identity;
using SecretProject.Authentication.Data.DataStore.Enums;
using System.Threading.Channels;

namespace SecretProject.Authentication.Data.DataStore.Entities;


public class AuthUser : IdentityUser
{
    #region Props
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; } = null;
    public bool IsMicrophoneMuted { get; set; } = false;
    public bool IsHeadphonesMuted { get; set; } = false;
    public ConnectionState Status { get; set; } = ConnectionState.Offline;
    #endregion

    #region Links
    public virtual ICollection<UserRoom>? LeftRooms { get; set; }
    public virtual ICollection<UserRoom>? RightRooms { get; set; }
    public virtual ICollection<Channel>? ChannelsAdmin { get; set; } = new List<Channel>();
    public virtual ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public virtual ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    public virtual ICollection<ChannelMessage> ChannelMessages { get; set; } = new List<ChannelMessage>();
    public virtual ICollection<ChannelUser> ChannelUsers { get; set; } = new List<ChannelUser>();
    public virtual ICollection<Friendship> Friends { get; set; } = new List<Friendship>();
    public virtual ICollection<Friendship> FriendOf { get; set; } = new List<Friendship>();
    public virtual ICollection<Reaction> Reactions { get; set; } = new List<Reaction>();
    #endregion
}
