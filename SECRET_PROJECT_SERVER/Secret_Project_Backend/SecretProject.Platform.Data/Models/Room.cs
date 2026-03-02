using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SecretProject.Platform.Data.Models;

public class Room
{
    [Key]
    public Guid Id { get; set; }
    public Guid[] MutedAudioUserIds { get; set; }
    public Guid[] MutedVideoUserIds { get; set; }
    public Guid[] BlockedUsers { get; set; }

    public Guid? ChannelId { get; set; }
    public Channel? Channel { get; set; }
}
