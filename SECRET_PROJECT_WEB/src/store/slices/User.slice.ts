import type { User } from "@/types/User/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
  userId: "123123",
  avatar:
    "https://yandex-images.clstorage.net/9k7rMr373/c31d18QV_S/WGj-CPnngrionSnUN-tShyU0kqCuyep1OHRw-yTKruGwVXUY8nnGqwh0ns1XGROoXcDKAs8LJgT_0PIbD0NJgxg_v1i_ucW4rYli3nvxXpcweI_ju4vzcT8tfKof9I2UwWteedgJ7tZFIsXPAVILvhCv8RCTTQ5O_LH3MSE2GMVeTuECzeP5v5-Zb8cb7GyYKFGXibaR1ggCZx7OB-y-pcxuZW3rGejodC_6_BVwcL4psetdnG0wasmH_AgUFjf9ZUTsEe_M-bqKukvYENBAkixwu6GQjc0HOkYm_hrBuoz3YlpmxCzM0lsuz8EHSWOVNJvpY7tOB0_TgvkuLiMo_kNC8hr5xOq_j4FF_h_wYZcraa-BoKf0AzZEJcgr3r2MwnlnYsU27MpMNcnbBWZOvQm_4XiKXQdv0JnaEg8qM9hZQsce4-P5jKC9dPUH11yrBEKalZmi5AwJcSXPLN64uPtdZ2L8J9HpRTvh5zZDZ4IxpOxEsEYrRvmT1zIHKATZfkjsGfvW7a-hpV78M-FltSlIkbW3q8cvF14b2y36qKTJYnhd2Qbw8E8h5eAMYkCjI7zAWLV1O2r9qPgtOiAH1V1o-B_x3O-Em6lVwiTqU4Y-c7e8gqLxCzxYKf4V_ri74lVHZP0b_uhrMdLII21MoAqb_UaQRQ9U6qfSBiIYHftcb-wo7cDjhLqmTts6_G6vFFO4lI2l1wIGcTjoF_Gbnc5xQGPEA-X1eDvu3Qp7VJoKicx5gmsOf9SW8iYaPhTmQ1jkDPL54a2biXbkJ8d4uAxJk7KJtMwOM1QI2zPBvbzMcntO_QbNwXsS4tk8QnOqM6rffYBWJX_rlfk3Ejw4wnlB6x_a9d22iJpmzhPxYoULU5qIk6jKPjdiC_Yh86Ci92ZaXOgfztNsNvzIFURCpgKIx3--Swh585n7AyUPN-FbbuAnwvjmrZqjZO4MyH2yMm2zlJa02hsrZCD3KMU",
  name: "John Doe",
  email: "john.doe@example.com",
  status: "Online",
  states: {
    isMicrophoneMuted: false,
    isHeadphonesMuted: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    changeMicrophoneState: (state, action: PayloadAction<boolean>) => {
      state.states.isMicrophoneMuted = action.payload;
    },
    changeHeadphonesState: (state, action: PayloadAction<boolean>) => {
      state.states.isHeadphonesMuted = action.payload;
    },
    changeName: (state, action) => {
      state.name = action.payload;
    },
    setUserStatus: (state, action: PayloadAction<Pick<User, "status">>) => {
      state.status = action.payload.status;
    },
    changeUserAvatar: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        avatar: action.payload + "?t=" + Date.now(),
      };
    },
  },
  selectors: {
    getUser: (state) => state,
    getUserAvatar: (state) => state.avatar,
    getUserAudioStates: (state) => state.states,
  },
});

export const {
  setUser,
  changeMicrophoneState,
  changeHeadphonesState,
  changeName,
  setUserStatus,
  changeUserAvatar,
} = userSlice.actions;
export const { getUser, getUserAvatar, getUserAudioStates } =
  userSlice.selectors;

export default userSlice.reducer;
