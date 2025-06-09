import type { ChannelDto } from "@/types/Channel/Channel";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: Record<string, ChannelDto> = {};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Record<string, ChannelDto>>) => {
      return action.payload;
    },
    addChannel: (state, action: PayloadAction<ChannelDto>) => {
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
    getChannelById: (state, action: PayloadAction<string>) => {
      return state[action.payload];
    },
  },
});

export const { setChannels, addChannel } = channelsSlice.actions;
export const { getChannelsList, getChannelById } = channelsSlice.selectors;

export default channelsSlice.reducer;
