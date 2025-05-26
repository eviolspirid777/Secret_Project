import { configureStore } from "@reduxjs/toolkit";
import autorizationReducer from "./slices/Autorization.slice";
import channelsReducer from "./slices/Channels.slice";

export const store = configureStore({
  reducer: {
    autorization: autorizationReducer,
    channels: channelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
