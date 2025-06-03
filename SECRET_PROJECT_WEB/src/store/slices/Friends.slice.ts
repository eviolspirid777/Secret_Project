import type { User } from "@/types/User/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: User[] = [];
const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
  },
  selectors: {
    getFriendById: (state, id) => {
      return state.find((friend) => friend.userId === id);
    },
  },
});

export const { setFriends } = friendsSlice.actions;
export const { getFriendById } = friendsSlice.selectors;

export default friendsSlice.reducer;
