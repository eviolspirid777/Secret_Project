export const useMessageAlert = () => {
  const playNotificationSound = () => {
    const notificationSound = new Audio(
      "/audio/NewMessage/new_message_tone.wav"
    );
    notificationSound.play();
  };

  return {
    playNotificationSound,
  };
};
