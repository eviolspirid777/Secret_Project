import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const unreadedMessagesUsersIdSlice = createSlice({
  name: "unreadedMessagesUsersId",
  initialState: [] as string[],
  reducers: {
    addUnreadedMessagesUserId: (state, action: PayloadAction<string>) => {
      if (!state.includes(action.payload)) {
        state.push(action.payload);
      }
    },
    removeUnreadedMessagesUserId: (state, action: PayloadAction<string>) => {
      return state.filter((id) => id !== action.payload);
    },
  },
  selectors: {
    getUnreadedMessagesUsersId: (state) => state,
  },
});

export const unreadedMessagesUsersIdReducer =
  unreadedMessagesUsersIdSlice.reducer;
export const { addUnreadedMessagesUserId, removeUnreadedMessagesUserId } =
  unreadedMessagesUsersIdSlice.actions;
export const { getUnreadedMessagesUsersId } =
  unreadedMessagesUsersIdSlice.selectors;
