import type { Channel } from "@/types/Channel/Channel";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, Channel> = [];

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action) => {
      return action.payload;
    },
  },
});

export const { setChannels } = channelsSlice.actions;

export default channelsSlice.reducer;
