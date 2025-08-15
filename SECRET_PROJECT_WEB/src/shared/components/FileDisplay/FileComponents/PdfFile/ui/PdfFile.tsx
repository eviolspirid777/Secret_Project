import PDFIcon from "/icons/FileIcons/Pdf/pdf_6l5aocu15qjr.svg";

import styles from "./styles.module.scss";
import type { FC } from "react";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";
import type { Message } from "@/types/Message/Message";

type PdfFileProps = {
  message: Message | ChannelMessage;
};

export const PdfFile: FC<PdfFileProps> = ({ message }) => {
  return (
    <div className={styles["pdf-container"]}>
      <img src={PDFIcon} alt="file" className={styles["pdf-container__icon"]} />
      <span className={styles["pdf-container__file-name"]}>
        {message.file?.fileName}
      </span>
    </div>
  );
};
