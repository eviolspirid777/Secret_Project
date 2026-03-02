using Riok.Mapperly.Abstractions;
using SecretProject.Platform.Data.DTOs.File;
using SecretProject.Platform.Data.DTOs.Messages;
using SecretProject.Platform.Data.DTOs.Reactions;
using SecretProject.Platform.Data.DTOs.RepliedMessage;
using SecretProject.Platform.Data.Models;

namespace SecretProject.Service.HttpGateway.Web.DataStore.Mappers.Messages;

[Mapper]
public static partial class MessageMapper
{
    [MapperIgnoreSource(nameof(Message.File))]
    [MapperIgnoreSource(nameof(Message.RepliedMessage))]
    [MapperIgnoreSource(nameof(Message.Reactions))]

    private static partial MessageDto Map(Message source);

    public static MessageDto MapMessageToMessageDto(Message source)
    {
        var target = Map(source);

        if(source.File != null)
        {
            target.File = new FileDto()
            {
                Id = source.File.Id.ToString(),
                FileName = source.File.FileName,
                FileType = source.File.FileType,
                FileUrl = source.File.FileUrl,
            };
        }

        if(source.RepliedMessage != null)
        {
            target.RepliedMessage = new RepliedMessageDTO();
            target.RepliedMessage.RepliedMessageId = source.RepliedMessage.Id;
            target.RepliedMessage.SenderName = source.RepliedMessage.Sender.DisplayName;
            target.RepliedMessage.Content = source.RepliedMessage.Content;
            if(source.RepliedMessage.File != null)
            {
                target.RepliedMessage.File = new FileDto
                {
                    Id = source.RepliedMessage.File.Id.ToString(),
                    FileName = source.RepliedMessage.File.FileName,
                    FileType = source.RepliedMessage.File.FileType,
                    FileUrl = source.RepliedMessage.File.FileUrl,
                };
            }
        }

        if(source.Reactions != null)
        {
            target.Reactions = new List<ReactionDto>();
            foreach(var reaction in source.Reactions)
            {
                target.Reactions.Add(new ReactionDto
                {
                    Id = reaction.Id.ToString(),
                    Emotion = reaction.Emotion,
                    MessageId = reaction.MessageId,
                    UserId = reaction.UserId,
                });
            }
        }
        return target;
    }
}
