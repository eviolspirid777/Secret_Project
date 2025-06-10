import { useEffect, useState } from "react";

import styles from "./styles.module.scss";

export const VoiceToasterChannel = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles["voice-toaster"]}>
      <h4 className={styles["voice-toaster__title"]}>Идет запись</h4>
      <div className={styles["voice-toaster__time-container"]}>
        <div className={styles["voice-toaster__time-container__flicker"]} />
        <span className={styles["voice-toaster__time-container__time"]}>
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
};
