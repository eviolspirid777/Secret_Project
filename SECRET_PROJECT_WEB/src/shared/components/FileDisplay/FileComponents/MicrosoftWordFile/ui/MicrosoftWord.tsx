import type { FC } from "react";
import MSWordIcon from "/icons/FileIcons/MWord/icons8-microsoft-word-64.svg";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";
import type { Message } from "@/types/Message/Message";

import styles from "./styles.module.scss";

type MicrosoftWordProps = {
  message: Message | ChannelMessage;
};

export const MicrosoftWord: FC<MicrosoftWordProps> = ({ message }) => {
  return (
    <div className={styles["ms-word-container"]}>
      <img
        src={MSWordIcon}
        alt="file"
        className={styles["ms-word-container__icon"]}
      />
      <span className={styles["ms-word-container__file-name"]}>
        {message.file?.fileName}
      </span>
    </div>
  );
};
