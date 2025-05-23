import { configureStore } from "@reduxjs/toolkit";
import autorizationReducer from "./slices/Autorization.slice";

export const store = configureStore({
  reducer: {
    autorization: autorizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
