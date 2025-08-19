namespace Secret_Project_Backend.Services.FriendshipSignalR
{
    public class FriendshipSignalRServiceTypes
    {
        public class FriendshipStatusChangeData
        {
            public string userId { get; set; }
            public string friendId { get; set; }
        }
    }
}
