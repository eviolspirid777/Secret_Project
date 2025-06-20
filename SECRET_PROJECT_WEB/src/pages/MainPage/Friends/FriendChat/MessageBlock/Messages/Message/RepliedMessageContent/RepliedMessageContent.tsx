import type { RepliedMessage } from "@/types/Message/Message";
import styles from "./styles.module.scss";
import type { FC } from "react";
import { getColorFromRoot } from "@/shared/helpers/GetColorFromRoot/GetColorFromRoot";

type RepliedMessageContentType = {
  repliedMessage: RepliedMessage;
};

export const RepliedMessageContent: FC<RepliedMessageContentType> = ({
  repliedMessage,
}) => {
  const handleScrollToMessage = () => {
    const element = document.getElementById(repliedMessage.repliedMessageId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      const previousColor = element.style.backgroundColor;
      const newColor = getColorFromRoot("--selection-color");
      element.style.transition = "background-color .25s ease-in-out";
      element.style.backgroundColor = newColor;
      setTimeout(() => {
        element.style.backgroundColor = previousColor;
      }, 4000);
    }
  };

  return (
    <div className={styles["replied-block"]} onClick={handleScrollToMessage}>
      <div className={styles["replied-block-content"]}>
        <strong className={styles["replied-block-content__sender"]}>
          {repliedMessage.senderName}
        </strong>
        <span className={styles["replied-block-content__message"]}>
          {repliedMessage.content}
        </span>
      </div>
    </div>
  );
};
