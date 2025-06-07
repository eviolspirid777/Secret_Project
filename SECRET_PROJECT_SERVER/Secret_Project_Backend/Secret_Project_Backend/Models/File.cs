using System.ComponentModel.DataAnnotations;

namespace Secret_Project_Backend.Models
{
    public class File
    {
        [Key]
        public Guid Id { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public string FileName { get; set; }

        public Guid MessageId { get; set; }
        public virtual Message Message { get; set; }
    }
}
