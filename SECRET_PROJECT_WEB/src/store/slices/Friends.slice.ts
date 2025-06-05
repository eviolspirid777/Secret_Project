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
    setFriendStatus: (
      state,
      action: PayloadAction<Pick<User, "userId" | "status">>
    ) => {
      return state.map((friend) => {
        if (friend.userId === action.payload.userId) {
          return { ...friend, status: action.payload.status };
        }
        return friend;
      });
    },
  },
  selectors: {
    getFriendById: (state, id) => {
      return state.find((friend) => friend.userId === id);
    },
  },
});

export const { setFriends, setFriendStatus } = friendsSlice.actions;
export const { getFriendById } = friendsSlice.selectors;

export default friendsSlice.reducer;
