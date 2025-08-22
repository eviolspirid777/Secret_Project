import type { User } from "@/types/User/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
  userId: "",
  avatar: "",
  name: "",
  email: "",
  status: "Online",
  states: {
    isMicrophoneMuted: false,
    isHeadphonesMuted: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    changeMicrophoneState: (state, action: PayloadAction<boolean>) => {
      state.states.isMicrophoneMuted = action.payload;
    },
    changeHeadphonesState: (state, action: PayloadAction<boolean>) => {
      state.states.isHeadphonesMuted = action.payload;
    },
    changeName: (state, action) => {
      state.name = action.payload;
    },
    setUserStatus: (state, action: PayloadAction<Pick<User, "status">>) => {
      state.status = action.payload.status;
    },
    changeUserAvatar: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        avatar: action.payload + "?t=" + Date.now(),
      };
    },
  },
  selectors: {
    getUser: (state) => state,
    getUserAvatar: (state) => state.avatar,
    getUserAudioStates: (state) => state.states,
  },
});

export const {
  setUser,
  changeMicrophoneState,
  changeHeadphonesState,
  changeName,
  setUserStatus,
  changeUserAvatar,
} = userSlice.actions;
export const { getUser, getUserAvatar, getUserAudioStates } =
  userSlice.selectors;

export default userSlice.reducer;
