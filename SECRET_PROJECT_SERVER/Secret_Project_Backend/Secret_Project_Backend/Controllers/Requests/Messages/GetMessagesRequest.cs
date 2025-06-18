namespace Secret_Project_Backend.Controllers.Requests.Messages
{
    public class GetMessagesRequest
    {
        public string FirstUserId { get; set; }
        public string SecondUserId { get; set; }
        public int Page { get; set; }
    }
}
