export type User = {
  userId: string,
  name: string,
  email: string,
  avatar: string,
  states: {
    isMicrophoneMuted: boolean,
    isHeadphonesMuted: boolean,
  }
}