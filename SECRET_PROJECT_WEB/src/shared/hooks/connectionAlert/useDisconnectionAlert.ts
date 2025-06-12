export const useDisconnectionAlert = () => {
  const playDisconnectionSound = () => {
    const disconnectionSound = new Audio(
      "/audio/ConnectDisconnect/disconnect.mp3"
    );
    disconnectionSound.play();
  };

  return {
    playDisconnectionSound,
  };
};
