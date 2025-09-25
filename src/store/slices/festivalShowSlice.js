import { createSlice } from "@reduxjs/toolkit";

const festivalShowSlice = createSlice({
  name: 'festivalShowSlice' ,
  initialState: {
    festivalInfo: {}, 
  },
  reducers: {
    setFestivalInfo(state, action) {
      state.festivalInfo = action.payload;
    },
  }
});

export const {
   setFestivalInfo, 
} = festivalShowSlice.actions;

export default festivalShowSlice.reducer;
