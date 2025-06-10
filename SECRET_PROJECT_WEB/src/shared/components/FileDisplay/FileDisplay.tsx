import { type Message } from "@/types/Message/Message";
import { type FC, useRef, useState } from "react";

import MSWordIcon from "/icons/FileIcons/MWord/icons8-microsoft-word-64.svg";
import PDFIcon from "/icons/FileIcons/Pdf/pdf_6l5aocu15qjr.svg";
import UnknowIcon from "/icons/FileIcons/UnknowFile/file-svgrepo-com.svg";
import { Button } from "@/shadcn/ui/button";
import { DownloadIcon } from "lucide-react";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";
import { IoIosPause, IoIosPlay } from "react-icons/io";

import styles from "./styles.module.scss";

type FileDisplayProps = {
  message: Message | ChannelMessage;
};

export const FileDisplay: FC<FileDisplayProps> = ({ message }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fileDisplayRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileDisply = () => {
    switch (message.file?.fileType) {
      case "audio/mp3": {
        const audio = document.createElement("audio");
        audio.src = message.file?.fileUrl || "";
        audio.controls = true;
        audio.style.display = "none";
        audio.onended = () => {
          setIsPlaying(false);
        };
        fileDisplayRef.current?.appendChild(audio);

        return (
          <div className={styles["file-display__audio-container"]}>
            {!isPlaying ? (
              <Button
                className={styles["file-display__audio-container__play-button"]}
                onClick={() => {
                  audio.play();
                  setIsPlaying(true);
                }}
              >
                <IoIosPlay />
              </Button>
            ) : (
              <Button
                className={
                  styles["file-display__audio-container__pause-button"]
                }
                onClick={() => {
                  audio.pause();
                  setIsPlaying(false);
                }}
              >
                <IoIosPause />
              </Button>
            )}
            <span>Голосовое сообщение</span>
          </div>
        );
      }
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/msword":
        return (
          <div className={styles["file-display__ms-word-container"]}>
            <img
              src={MSWordIcon}
              alt="file"
              className={styles["file-display__ms-word-container__icon"]}
            />
            <span
              className={styles["file-display__ms-word-container__file-name"]}
            >
              {message.file?.fileName}
            </span>
          </div>
        );
      case "application/pdf":
        return (
          <div className={styles["file-display__pdf-container"]}>
            <img
              src={PDFIcon}
              alt="file"
              className={styles["file-display__pdf-container__icon"]}
            />
            <span className={styles["file-display__pdf-container__file-name"]}>
              {message.file?.fileName}
            </span>
          </div>
        );
      case "image/jpeg":
      case "image/png":
      case "image/jpg":
      case "image/gif":
      case "image/webp":
      case "image/tiff":
      case "image/bmp":
        return (
          <img
            src={message.file?.fileUrl}
            alt="file"
            className={styles["file-display"]}
          />
        );
      default:
        return (
          <div className={styles["file-display__unknow-container"]}>
            <img
              src={UnknowIcon}
              alt="file"
              className={styles["file-display__unknow-container__icon"]}
            />
            <span
              className={styles["file-display__unknow-container__file-name"]}
            >
              {message.file?.fileName}
            </span>
          </div>
        );
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
      {isHovered && (
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
