import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const selectedChatIdSlice = createSlice({
  name: "selectedChatId",
  initialState: "",
  reducers: {
    setSelectedChatId: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
  },
  selectors: {
    getSelectedChatId: (state) => state,
  },
});

export const selectedChatIdReducer = selectedChatIdSlice.reducer;

export const { setSelectedChatId } = selectedChatIdSlice.actions;
export const { getSelectedChatId } = selectedChatIdSlice.selectors;
