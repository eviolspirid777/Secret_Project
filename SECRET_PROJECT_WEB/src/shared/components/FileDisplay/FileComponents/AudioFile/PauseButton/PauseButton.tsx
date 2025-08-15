import type { FC } from "react";
import { Button } from "@/shadcn/ui/button";
import { IoIosPause } from "react-icons/io";

import styles from "./styles.module.scss";

type PauseButtonProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  setIsPlaying: (value: React.SetStateAction<boolean>) => void;
};

export const PauseButton: FC<PauseButtonProps> = ({
  audioRef,
  setIsPlaying,
}) => {
  return (
    <Button
      className={styles["pause-button"]}
      onClick={() => {
        audioRef.current?.pause();
        setIsPlaying(false);
      }}
    >
      <IoIosPause />
    </Button>
  );
};
