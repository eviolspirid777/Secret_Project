import type { Message } from "@/types/Message/Message";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: Message[] = [
  {
    message: "Hello",
    senderId: "1",
    receiverId: "2",
    createdAt: new Date("2025-05-30T10:00:00"),
  },
  {
    message: "It is me",
    senderId: "1",
    receiverId: "2",
    createdAt: new Date("2025-05-31T10:00:00"),
  },
  {
    message: "Hello",
    senderId: "1",
    receiverId: "2",
    createdAt: new Date("2025-05-31T13:00:00"),
  },
];

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
