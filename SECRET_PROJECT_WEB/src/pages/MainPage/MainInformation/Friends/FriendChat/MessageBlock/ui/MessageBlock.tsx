import type { FC } from "react";
import { useCallback, useState } from "react";
import { useAddMessage } from "@/shared/hooks/message/useAddMessage";
import { InputBlock } from "../InputBlock/ui";
import { Messages } from "../Messages/ui";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type { Message } from "@/types/Message/Message";

type MessageBlockProps = {
  friendId: string;
};

export const MessageBlock: FC<MessageBlockProps> = ({ friendId }) => {
  const userId = localStorageService.getUserId() ?? "";

  const [message, setMessage] = useState("");
  const [repliedMessage, setRepliedMessage] = useState<Message>();
  const [file, setFile] = useState<File | null>(null);

  const { addMessageAsync } = useAddMessage();

  const sendMessage = useCallback(
    async (message: string | null, fileLocal?: File) => {
      if (friendId) {
        const formData = new FormData();
        if (fileLocal || file) {
          formData.append("file", fileLocal ?? file!);
          formData.append("fileType", fileLocal?.type ?? file!.type);
          formData.append("fileName", fileLocal?.name ?? file!.name);
        }
        formData.append("senderId", userId);
        formData.append("reciverId", friendId);
        if (message) {
          formData.append("content", message);
        }
        if (repliedMessage) {
          formData.append("repliedMessageId", repliedMessage.id);
        }

        await addMessageAsync(formData);
        setMessage("");
        setRepliedMessage(undefined);
      }
    },
    [friendId, file, addMessageAsync, repliedMessage, userId]
  );

  const sendFile = useCallback((file: File | null) => {
    setFile(file);
  }, []);

  return (
    <>
      <Messages friendId={friendId} setRepliedMessage={setRepliedMessage} />
      <InputBlock
        message={message}
        repliedMessage={repliedMessage}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendFile={sendFile}
      />
    </>
  );
};
