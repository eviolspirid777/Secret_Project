import { useState, type FC } from "react";
import styles from "./styles.module.scss";
import { ImageFullscreen } from "../ImageFullscreen/ImageFullscreen";
import type { Message } from "@/types/Message/Message";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";

type ImageFileProps = {
  message: Message | ChannelMessage;
};

export const ImageFile: FC<ImageFileProps> = ({ message }) => {
  const [bigPictureMode, setBigPictureMode] = useState(false);

  const handleBigPicture = () => {
    setBigPictureMode(!bigPictureMode);
  };

  return (
    <>
      <img
        src={message.file?.fileUrl}
        alt="file"
        className={styles["file-display"]}
        onClick={handleBigPicture}
      />
      {bigPictureMode && (
        <ImageFullscreen
          src={message.file?.fileUrl}
          onBackgroundClick={handleBigPicture}
        />
      )}
    </>
  );
};
