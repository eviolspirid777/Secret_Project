﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Secret_Project_Backend.Models
{
    public class Room
    {
        [Key]
        public Guid Id { get; set; }
        public Guid[]? MutedAudioUserIds { get; set; }
        public Guid[]? MutedVideoUserIds { get; set; }
        public Guid[]? BlockedUsers { get; set; }

        public Guid? ChannelId { get; set; }
        public Channel? Channel { get; set; }
        public string? UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
