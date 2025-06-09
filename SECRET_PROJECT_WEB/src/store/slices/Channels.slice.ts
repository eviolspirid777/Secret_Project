import type { Channel } from "@/types/Channel/Channel";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Record<string, Channel> = {};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action) => {
      return action.payload;
    },
    addChannel: (state, action) => {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    },
  },
  selectors: {
    getChannelsList: (state) => {
      return Object.values(state);
    },
  },
});

export const { setChannels, addChannel } = channelsSlice.actions;
export const { getChannelsList } = channelsSlice.selectors;

export default channelsSlice.reducer;
