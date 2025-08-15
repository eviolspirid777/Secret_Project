import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import type { Dispatch, FC } from "react";
import { SmileBlock } from "./SmileBlock/SmileBlock";
import { FileInput } from "./FileInput/FileInput";

import styles from "./styles.module.scss";
import { memo, useState } from "react";
import { VoiceMessage } from "./VoiceMessage/VoiceMessage";
import type { Message } from "@/types/Message/Message";

type InputBlockProps = {
  message: string;
  repliedMessage?: Message;
  setMessage: Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string | null, fileLocal?: File) => void;
  sendFile: (file: File | null) => void;
};

export const InputBlock: FC<InputBlockProps> = memo(
  ({ message, repliedMessage, setMessage, sendMessage, sendFile }) => {
    const [fileCount, setFileCount] = useState(0);

    const handleSendMessage = () => {
      sendMessage(message);
      setMessage("");
      sendFile(null);
      setFileCount(0);
    };

    const handleSendAudioMessage = (audio: Blob) => {
      const file = new File([audio], "audio.mp3", { type: "audio/mp3" });
      sendMessage(null, file);
    };

    return (
      <div className={styles["friend-chat__input-container"]}>
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
          className={styles["friend-chat__input"]}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Сообщение..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <VoiceMessage sendAudioMessage={handleSendAudioMessage} />
        <Button onClick={handleSendMessage}>Отправить</Button>
      </div>
    );
  }
);
