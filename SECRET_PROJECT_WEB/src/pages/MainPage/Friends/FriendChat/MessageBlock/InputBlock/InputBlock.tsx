import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import type { FC } from "react";
import { SmileBlock } from "./SmileBlock/SmileBlock";
import { FileInput } from "./FileInput/FileInput";

import styles from "./styles.module.scss";

type InputBlockProps = {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  sendFile: (file: File) => void;
};

export const InputBlock: FC<InputBlockProps> = ({
  message,
  setMessage,
  sendMessage,
  sendFile,
}) => {
  return (
    <div className={styles["friend-chat__input-container"]}>
      <FileInput sendFile={sendFile} />
      <SmileBlock setMessage={setMessage} />
      <Input
        className={styles["friend-chat__input"]}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Сообщение..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(message);
          }
        }}
      />
      <Button onClick={() => sendMessage(message)}>Отправить</Button>
    </div>
  );
};
