import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import type { Dispatch, FC } from "react";
import { SmileBlock } from "./SmileBlock/SmileBlock";
import { FileInput } from "./FileInput/FileInput";

import styles from "./styles.module.scss";
import { memo, useState } from "react";

type InputBlockProps = {
  message: string;
  setMessage: Dispatch<React.SetStateAction<string>>;
  sendMessage: (message: string) => void;
  sendFile: (file: File | null) => void;
};

export const InputBlock: FC<InputBlockProps> = memo(
  ({ message, setMessage, sendMessage, sendFile }) => {
    const [fileCount, setFileCount] = useState(0);

    const handleSendMessage = () => {
      sendMessage(message);
      setMessage("");
      sendFile(null);
      setFileCount(0);
    };

    return (
      <div className={styles["friend-chat__input-container"]}>
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
        <Button onClick={handleSendMessage}>Отправить</Button>
      </div>
    );
  }
);
