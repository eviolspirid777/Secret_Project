import { configureStore } from "@reduxjs/toolkit";
import autorizationReducer from "./slices/Autorization.slice";
import channelsReducer from "./slices/Channels.slice";
import userReducer from "./slices/User.slice";
import friendsReducer from "./slices/Friends.slice";

export const store = configureStore({
  reducer: {
    autorization: autorizationReducer,
    channels: channelsReducer,
    user: userReducer,
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
