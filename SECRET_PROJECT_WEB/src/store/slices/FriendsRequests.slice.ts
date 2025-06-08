import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const friendsRequestsSlice = createSlice({
  name: "friendsRequests",
  initialState: [] as string[],
  reducers: {
    addFriendRequest: (state, action: PayloadAction<string>) => {
      return [...state, action.payload];
    },
    removeFriendRequest: (state, action: PayloadAction<string>) => {
      return state.filter((request) => request !== action.payload);
    },
  },
  selectors: {
    getFriendsRequests: (state) => state,
  },
});

export const friendsRequestsReducer = friendsRequestsSlice.reducer;

export const { addFriendRequest, removeFriendRequest } =
  friendsRequestsSlice.actions;

export const { getFriendsRequests } = friendsRequestsSlice.selectors;
