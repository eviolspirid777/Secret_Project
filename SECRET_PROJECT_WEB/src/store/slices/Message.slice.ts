import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type { Message } from "@/types/Message/Message";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: Record<string, Message[]> = {};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const userId =
        localStorageService.getUserId() === action.payload.senderId
          ? action.payload.reciverId
          : action.payload.senderId;

      if (!state[userId]) {
        state[action.payload.senderId] = [action.payload];
      }

      state[userId].push(action.payload);
    },
    setMessages: (
      state,
      action: PayloadAction<{ senderId: string; messages: Message[] }>
    ) => {
      state[action.payload.senderId] = action.payload.messages;
    },
    deleteMessage: (
      state,
      action: PayloadAction<Pick<Message, "id" | "senderId">>
    ) => {
      state[action.payload.senderId] = state[action.payload.senderId].filter(
        (message) => message.id !== action.payload.id
      );
    },
  },
  selectors: {
    getMessages: (state, senderId: string) =>
      state[senderId]
        ? [...state[senderId]].sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          )
        : [],
  },
});

export const { addMessage, deleteMessage, setMessages } = messageSlice.actions;
export const { getMessages } = messageSlice.selectors;

export default messageSlice.reducer;
