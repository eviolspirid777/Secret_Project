import { type Message } from "@/types/Message/Message";
import { type FC, useRef, useState } from "react";

import { Button } from "@/shadcn/ui/button";
import { DownloadIcon } from "lucide-react";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";
import { AudioFile } from "../FileComponents/AudioFile/ui/Audio";
import { ImageFile } from "../FileComponents/ImageFile/ui/ImageFile";
import { MicrosoftWord } from "../FileComponents/MicrosoftWordFile/ui/MicrosoftWord";
import { PdfFile } from "../FileComponents/PdfFile/ui/PdfFile";

import styles from "./styles.module.scss";
import { UnknownFile } from "../FileComponents/UnknownFile/ui/UnknownFile";

type FileDisplayProps = {
  message: Message | ChannelMessage;
};

export const FileDisplay: FC<FileDisplayProps> = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileDisplayRef = useRef<HTMLDivElement>(null);

  const fileDisply = () => {
    switch (message.file?.fileType) {
      case "audio/mp3": {
        return <AudioFile message={message} />;
      }
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return <MicrosoftWord message={message} />;
      case "application/pdf":
        return <PdfFile message={message} />;
      case "image/jpeg":
      case "image/png":
      case "image/jpg":
      case "image/gif":
      case "image/webp":
      case "image/tiff":
      case "image/bmp":
        return <ImageFile message={message} />;
      default:
        return <UnknownFile message={message} />;
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(message.file?.fileUrl || "");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = message.file?.fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      ref={fileDisplayRef}
      onMouseEnter={setIsHovered.bind(null, true)}
      onMouseLeave={setIsHovered.bind(null, false)}
      className={styles["file-display-container"]}
    >
      {fileDisply()}
      {isHovered &&
        ![undefined, "audio/mp3"].includes(message.file?.fileType) && (
          <Button
            variant="outline"
            size="icon"
            className={styles["file-display__download-button"]}
            onClick={handleDownload}
          >
            <DownloadIcon />
          </Button>
        )}
    </div>
  );
};
