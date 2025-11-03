import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeedById: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
    removeFeed: (state, action) => {
      return null;
    },
  },
});

export const { addFeed, removeFeed, removeFeedById } = feedSlice.actions;

export default feedSlice.reducer;
