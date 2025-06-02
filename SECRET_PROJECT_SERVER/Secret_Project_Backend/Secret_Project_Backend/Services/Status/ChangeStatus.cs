
using Microsoft.EntityFrameworkCore;
using Secret_Project_Backend.Context;
using Secret_Project_Backend.Models;

namespace Secret_Project_Backend.Services.Status
{
    public class ChangeUserStatusService
    {
        private readonly PostgreSQLDbContext _dbContext;
        public ChangeUserStatusService(
            PostgreSQLDbContext dbContext
        )
        {
            _dbContext = dbContext;
        }
        public async Task<bool> ChangeStatusAsync(ConnectionState state, string id)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return false;
            }

            user.Status = state;
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
