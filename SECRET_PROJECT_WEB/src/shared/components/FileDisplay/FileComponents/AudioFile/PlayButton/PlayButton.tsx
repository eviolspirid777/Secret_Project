import { Button } from "@/shadcn/ui/button";
import type { FC } from "react";
import { IoIosPlay } from "react-icons/io";

import styles from "./styles.module.scss"

type PlayButtonProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>,
  setIsPlaying: (value: React.SetStateAction<boolean>) => void
}

export const PlayButton: FC<PlayButtonProps> = ({
  audioRef,
  setIsPlaying
}) => {
  return (
    <Button
    className={styles["play-button"]}
    onClick={() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }}
  >
    <IoIosPlay />
  </Button>
  )
}