import { Button } from "@/shadcn/ui/button";
import { Smile } from "lucide-react";
import { useEffect, useRef, useState, type FC } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import styles from "./styles.module.scss";

type EmojiData = {
  native: string;
  id: string;
  name: string;
  unified: string;
};

type SmileBlockProps = {
  setMessage: (emoji: string) => void;
};

export const SmileBlock: FC<SmileBlockProps> = ({ setMessage }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleEmojiSelect = (emoji: EmojiData) => {
    setMessage(emoji.native);
  };

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

  return (
    <div className={styles["emoji-picker-container"]} ref={pickerRef}>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={setIsPickerOpen.bind(null, (prev) => !prev)}
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
  );
};
