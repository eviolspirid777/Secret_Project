import { createSlice } from "@reduxjs/toolkit";

export const autorizationSlice = createSlice({
  name: "autorization",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setIsLoggedIn } = autorizationSlice.actions;

export default autorizationSlice.reducer;