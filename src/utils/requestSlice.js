import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,

  reducers: {
    addRequests: (state, action) => {
      return action.payload;
    },
    removeRequestsById: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
    removeRequests: (state, action) => {
      return null;
    },
  },
});

export const { addRequests, removeRequests, removeRequestsById } =
  requestSlice.actions;
export default requestSlice.reducer;
