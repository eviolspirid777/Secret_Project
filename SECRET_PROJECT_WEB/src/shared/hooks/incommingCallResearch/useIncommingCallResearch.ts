import { useEffect, useState } from "react";
import { useIncommingCall } from "../incommingCall/useIncommingCall";
import { messageSignalRServiceInstance } from "@/shared/services/SignalR/Messages/MessageSignalRService";
import type { UserShortDto } from "@/types/User/User";

export const useIncommingCallResearch = (
  setIsCallDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { playIncommingCallSound, stopIncommingCallSound } = useIncommingCall();
  const [caller, setCaller] = useState<UserShortDto | null>(null);

  useEffect(() => {
    messageSignalRServiceInstance.onIncommingCallReceive((caller) => {
      playIncommingCallSound();
      setIsCallDrawerOpen(true);
      setCaller(caller);
    });

    messageSignalRServiceInstance.onIncommingCallAbort((caller) => {
      console.dir(caller);
      stopIncommingCallSound();
      setIsCallDrawerOpen(false);
      setCaller(null);
    });

    return () => {
      messageSignalRServiceInstance.stopOnIncommingCallAbort();
      messageSignalRServiceInstance.stopOnIncommingCallReceive();
    };
  }, []);

  return {
    stopIncommingCallSound,
    playIncommingCallSound,
    caller,
  };
};
