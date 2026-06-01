using System;
using System.Collections.Generic;
using System.Text;

namespace SecretProject.User.Data.DataStore.Entities
{
    public class Friendship
    {
        public required Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required Guid FriendId { get; set; }
        public FriendshipStatus Status { get; set; }
    }
    public enum FriendshipStatus
    {
        Pending,
        Accepted,
        Blocked
    }
}
