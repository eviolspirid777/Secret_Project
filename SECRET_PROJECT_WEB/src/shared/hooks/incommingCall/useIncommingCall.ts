import { useRef } from "react";

export const useIncommingCall = () => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const incommingCallSound = useRef<null | HTMLAudioElement>(null);

  const playIncommingCallSound = () => {
    incommingCallSound.current = new Audio(
      "/audio/IncommingCall/IncommingCall.wav"
    );

    intervalRef.current = setInterval(() => {
      incommingCallSound.current?.play();
    }, 4000);
  };

  const stopIncommingCallSound = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (incommingCallSound.current) {
      incommingCallSound.current.pause();
      incommingCallSound.current.currentTime = 0;
    }
  };

  return {
    playIncommingCallSound,
    stopIncommingCallSound,
  };
};
