import type { FC } from "react";
import UnknowIcon from "/icons/FileIcons/UnknowFile/file-svgrepo-com.svg";

import styles from "./styles.module.scss";
import type { Message } from "@/types/Message/Message";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";

type UnknownFileProps = {
  message: Message | ChannelMessage;
};

export const UnknownFile: FC<UnknownFileProps> = ({ message }) => {
  return (
    <div className={styles["unknow-container"]}>
      <img
        src={UnknowIcon}
        alt="file"
        className={styles["unknow-container__icon"]}
      />
      <span className={styles["unknow-container__file-name"]}>
        {message.file?.fileName}
      </span>
    </div>
  );
};
