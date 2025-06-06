import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import type { FC } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";

type InputBlockProps = {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
};

type EmojiData = {
  native: string;
  id: string;
  name: string;
  unified: string;
};

export const InputBlock: FC<InputBlockProps> = ({
  message,
  setMessage,
  sendMessage,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const listener = (event: Event) => {
      const el = pickerRef?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    const blurListener = () => {
      setIsPickerOpen(false);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    pickerRef.current?.addEventListener("blur", blurListener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      pickerRef.current?.removeEventListener("blur", blurListener);
    };
  }, [pickerRef]);

  const handleEmojiSelect = (emoji: EmojiData) => {
    setMessage(message + emoji.native);
  };

  // const computeData = async () => {
  //   const response = await fetch(
  //     "https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/15/apple.json"
  //   );

  //   return response.json();
  // };

  return (
    <div className={styles["friend-chat__input-container"]}>
      <div className={styles["emoji-picker-container"]} ref={pickerRef}>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          onClick={() => setIsPickerOpen(!isPickerOpen)}
          className={styles["emoji-button"]}
        >
          <Smile className="h-5 w-5" />
        </Button>
        {isPickerOpen && (
          <div className={styles["picker-wrapper"]}>
            <Picker
              // data={computeData}
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="dark"
              locale="ru"
              emojiSize={25}
              // set="apple"
              set="native"
            />
          </div>
        )}
      </div>
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
