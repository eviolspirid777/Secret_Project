import { Input } from "@/shadcn/ui/input";

import styles from "./styles.module.scss";
import { useState, type FC } from "react";
import { Button } from "@/shadcn/ui/button";
import { FileInput } from "@/pages/MainPage/MainInformation/Friends/FriendChat/MessageBlock/InputBlock/FileInput/ui";
import { SmileBlock } from "@/pages/MainPage/MainInformation/Friends/FriendChat/MessageBlock/InputBlock/SmileBlock/ui";
import { VoiceMessageChannel } from "../VoiceMessageChannel/ui";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";

type InputChannelMessageBlockProps = {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string | null, fileLocal?: File) => void;
  sendFile: (file: File | null) => void;
  repliedMessage?: ChannelMessage;
};

export const InputChannelMessageBlock: FC<InputChannelMessageBlockProps> = ({
  message,
  repliedMessage,
  setMessage,
  sendMessage,
  sendFile,
}) => {
  const [fileCount, setFileCount] = useState(0);

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
    sendFile(null);
    setFileCount(0);
  };

  const handleSendAudioMessage = (audio: File) => {
    sendMessage(null, audio);
  };

  return (
    <div className={styles["channel-chat__input-container"]}>
      <span className="text-red-300 absolute t-0 l-0">
        {repliedMessage?.content}
      </span>
      <FileInput
        sendFile={sendFile}
        fileCount={fileCount}
        setFileCount={setFileCount}
      />
      <SmileBlock setMessage={setMessage} />
      <Input
        className={styles["channel-chat__input"]}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Сообщение..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      <VoiceMessageChannel sendAudioMessage={handleSendAudioMessage} />
      <Button onClick={handleSendMessage}>Отправить</Button>
    </div>
  );
};
