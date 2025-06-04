import type { Message } from "@/types/Message/Message";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: Message[] = [];

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.push(action.payload);
    },
  },
  selectors: {
    getMessages: (state) => state,
  },
});

export const { addMessage } = messageSlice.actions;
export const { getMessages } = messageSlice.selectors;

export default messageSlice.reducer;
