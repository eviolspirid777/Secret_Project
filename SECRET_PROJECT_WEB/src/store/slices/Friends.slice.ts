import type { Friend } from "@/types/Friend/Friend";
import { createSlice } from "@reduxjs/toolkit";

const initialState: Friend[] = [
  {
    id: "1",
    name: "Илья Муромец",
    avatar: "https://cs5.pikabu.ru/post_img/big/2015/12/24/10/1450973783198547710.jpg",
    status: "Online",
  },
  {
    id: "2",
    name: "Алеша Попович",
    avatar: "https://i.pinimg.com/736x/87/c4/d6/87c4d61b84443e9b854d6ddeba40bcc7.jpg",
    status: "Offline",
  },
  {
    id: "3",
    name: "Добрыня Никитич",
    avatar: "https://cdn.trinixy.ru/pics5/20151217/bogatiri_03.jpg",
    status: "NotDisturb",
  },
  {
    id: "4",
    name: "Царь Борис",
    avatar: "https://img06.rl0.ru/afisha/e1200x1200i/daily.afisha.ru/uploads/images/f/a6/fa6b596c710d49c1b5501b4e0a0bb61d.png",
    status: "Sleeping",
  },
];

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state = action.payload;
    }
  }
})

export const { setFriends } = friendsSlice.actions;

export default friendsSlice.reducer;

