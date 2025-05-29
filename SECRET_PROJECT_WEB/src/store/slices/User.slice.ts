import type { User } from "@/types/User/user";
import { createSlice } from "@reduxjs/toolkit";

const user: User = {
  userId: "123123",
  avatar: "https://i.pinimg.com/originals/00/00/00/00000000000000000000000000000000.jpg",
  name: "John Doe",
  email: "john.doe@example.com",
  states: {
    isMicrophoneMuted: false,
    isHeadphonesMuted: false,
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: user,
  },
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    changeMicrophoneState: (state) => {
      state.userInfo.states.isMicrophoneMuted = !state.userInfo.states.isMicrophoneMuted;
    },
    changeHeadphonesState: (state) => {
      state.userInfo.states.isHeadphonesMuted = !state.userInfo.states.isHeadphonesMuted;
    },
  },
});

export const { setUser, changeMicrophoneState, changeHeadphonesState } = userSlice.actions;

export default userSlice.reducer;
