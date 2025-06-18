import type { FC } from "react";
import { useCallback, useState } from "react";
import { useAddMessage } from "@/shared/hooks/message/useAddMessage";
import { InputBlock } from "./InputBlock/InputBlock";
import { Messages } from "./Messages/Messages";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

type MessageBlockProps = {
  friendId: string;
};

//TODO: https://www.youtube.com/watch?v=DOKp4KiVIb4&ab_channel=CandDev React Infinite Scrolling

export const MessageBlock: FC<MessageBlockProps> = ({ friendId }) => {
  const userId = localStorageService.getUserId() ?? "";

  const [message, setMessage] = useState("");
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

        await addMessageAsync(formData);
        setMessage("");
      }
    },
    [friendId, file, addMessageAsync]
  );

  const sendFile = useCallback((file: File | null) => {
    setFile(file);
  }, []);

  return (
    <>
      <Messages friendId={friendId} />
      <InputBlock
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendFile={sendFile}
      />
    </>
  );
};
