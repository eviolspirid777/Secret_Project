import { useRef, useState, type FC } from "react";
import styles from "./styles.module.scss";
import {
  isChannelMessage,
  type ChannelMessage,
} from "@/types/ChannelMessage/ChannelMessage";
import { PauseButton } from "../PauseButton/PauseButton";
import { PlayButton } from "../PlayButton/PlayButton";
import type { Message } from "@/types/Message/Message";

type AudioFileProps = {
  message: ChannelMessage | Message;
};

export const AudioFile: FC<AudioFileProps> = ({ message }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (isChannelMessage(message)) {
    return (
      <div className={styles["audio-container"]}>
        <audio
          ref={audioRef}
          src={message.file?.fileUrl || ""}
          onEnded={setIsPlaying.bind(null, false)}
          onPlay={setIsPlaying.bind(null, true)}
          onPause={setIsPlaying.bind(null, false)}
          style={{ display: "none" }}
          controls
        />
        {!isPlaying ? (
          <PlayButton audioRef={audioRef} setIsPlaying={setIsPlaying} />
        ) : (
          <PauseButton audioRef={audioRef} setIsPlaying={setIsPlaying} />
        )}
        <span>Голосовое сообщение</span>
      </div>
    );
  }

  return null;
};
