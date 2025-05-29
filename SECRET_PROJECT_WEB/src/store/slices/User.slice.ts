import type { User } from "@/types/User/user";
import { createSlice } from "@reduxjs/toolkit";

const initialState: User = {
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
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload;
    },
    changeMicrophoneState: (state) => {
      state.states.isMicrophoneMuted = !state.states.isMicrophoneMuted;
    },
    changeHeadphonesState: (state) => {
      state.states.isHeadphonesMuted = !state.states.isHeadphonesMuted;
    },
  },
});

export const { setUser, changeMicrophoneState, changeHeadphonesState } = userSlice.actions;

export default userSlice.reducer;
