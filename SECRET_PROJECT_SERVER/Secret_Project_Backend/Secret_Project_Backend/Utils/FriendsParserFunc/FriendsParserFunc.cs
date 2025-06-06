using Secret_Project_Backend.Controllers.Requests.Messages;
using Secret_Project_Backend.Models;
using System.Linq.Expressions;

namespace Secret_Project_Backend.Utils.FriendsParserFunc
{
    public class FriendsParserFunc
    {
        public static Expression<Func<Message, bool>> FriendsFunc(GetMessagesRequest data)
        {
            return m => (m.ReciverId == data.FirstUserId && m.SenderId == data.SecondUserId) ||
                       (m.ReciverId == data.SecondUserId && m.SenderId == data.FirstUserId);
        }
    }
}
