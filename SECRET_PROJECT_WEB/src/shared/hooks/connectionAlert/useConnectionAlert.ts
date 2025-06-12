export const useConnectionAlert = () => {
  const playConnectionSound = () => {
    const connectionSound = new Audio("/audio/ConnectDisconnect/connect.mp3");
    connectionSound.play();
  };

  return {
    playConnectionSound,
  };
};
