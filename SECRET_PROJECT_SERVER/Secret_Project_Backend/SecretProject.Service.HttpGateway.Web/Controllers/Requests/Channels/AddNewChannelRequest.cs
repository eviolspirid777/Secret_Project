namespace Secret_Project_Backend.Controllers.Requests.Channels
{
    public class AddNewChannelRequest
    {
        public string Name { get; set; }
        public string ChannelAvatarUrl { get; set; }
        public string AdminId { get; set; }
    }
}
