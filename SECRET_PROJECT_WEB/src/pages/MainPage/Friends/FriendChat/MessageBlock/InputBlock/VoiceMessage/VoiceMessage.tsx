import { TiMicrophoneOutline } from "react-icons/ti";

import styles from "./styles.module.scss";
import { Button } from "@/shadcn/ui/button";
import { useEffect, useRef, useState, type FC } from "react";
import { toast } from "sonner";
import { VoiceToaster } from "./VoiceToaster/VoiceToaster";

type VoiceMessageProps = {
  sendAudioMessage: (audio: Blob) => void;
};

export const VoiceMessage: FC<VoiceMessageProps> = ({ sendAudioMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const stream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((streamLocal) => {
      stream.current = streamLocal;
    });
  }, []);

  const handleStartRecording = async () => {
    if (!stream.current) return;

    setIsRecording(true);

    const id = toast(<VoiceToaster />, {
      duration: Infinity,
      position: "top-center",
      className: "voice-toaster-test",
    });

    setToastId(id);

    mediaRecorder.current = new MediaRecorder(stream.current);

    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.start();
  };

  const handleStopRecording = () => {
    if (!mediaRecorder.current) return;

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current);
      audioChunks.current = [];
      sendAudioMessage(audioBlob);
    };

    setIsRecording(false);
    mediaRecorder.current?.stop();
    toast.dismiss(toastId);
  };

  const handleInterruptRecording = () => {
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stop();
    toast.dismiss(toastId);
    setIsRecording(false);
  };

  return (
    <Button
      className={`${styles["voice-message"]} ${
        isRecording && styles["voice-message__recording"]
      }`}
      onMouseDown={handleStartRecording}
      onMouseUp={handleStopRecording}
      onMouseLeave={handleInterruptRecording}
    >
      <TiMicrophoneOutline />
    </Button>
  );
};
