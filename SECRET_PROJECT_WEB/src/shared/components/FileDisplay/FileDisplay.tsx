import { type Message } from "@/types/Message/Message";
import { type FC } from "react";
import MSWordIcon from "/icons/FileIcons/MWord/icons8-microsoft-word-64.svg";

import styles from "./styles.module.scss";

type FileDisplayProps = {
  message: Message;
};

export const FileDisplay: FC<FileDisplayProps> = ({ message }) => {
  const fileDisply = () => {
    switch (message.fileType) {
      case "application/msword":
        return (
          <img
            src={MSWordIcon}
            alt="file"
            className={styles["file-display__ms-word"]}
          />
        );
      case "application/pdf":
        return <div>PDF</div>;
      default:
        return (
          <img
            src={message.fileUrl}
            alt="file"
            className={styles["file-display"]}
          />
        );
    }
  };

  return fileDisply();
};

//application/msword
