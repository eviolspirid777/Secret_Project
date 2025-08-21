import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type { Message } from "@/types/Message/Message";
import type { ReactionDto } from "@/types/Reaction/Reaction";
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
    addReaction: (
      state,
      action: PayloadAction<{ chatId: string; reaction: ReactionDto }>
    ) => {
      console.log("TRIGGERED");
      const message = state[action.payload.chatId].find(
        (message) => message.id === action.payload.reaction.messageId
      );
      if (
        message?.reactions?.some(
          (reaction) => reaction.userId === action.payload.reaction.userId
        )
      ) {
        message.reactions = message.reactions.filter(
          (el) => el.userId !== action.payload.reaction.userId
        );
      }
      message?.reactions?.push({
        ...action.payload.reaction,
        id: "000-000-000-000",
      });
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
    getMessageReactions: (
      state,
      { messageId, senderId }: { messageId: string; senderId: string }
    ) => state[senderId]?.find((el) => el.id === messageId)?.reactions,
  },
});

export const { addMessage, deleteMessage, setMessages, addReaction } =
  messageSlice.actions;
export const { getMessages, getMessageReactions } = messageSlice.selectors;

export default messageSlice.reducer;
