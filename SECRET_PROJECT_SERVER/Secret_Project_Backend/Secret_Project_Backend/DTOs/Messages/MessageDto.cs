﻿using Secret_Project_Backend.DTOs.File;

namespace Secret_Project_Backend.DTOs.Messages
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string SenderId { get; set; }
        public string ReciverId { get; set; }
        public DateTime SentAt { get; set; }
        public FileDto File { get; set; }
    }
}
