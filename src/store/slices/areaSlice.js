import { createSlice } from "@reduxjs/toolkit";
import { fetchSidos, fetchSigungu } from "../thunks/areaThunk.js";

const areaSlice = createSlice({
  name: "area",
  initialState: {
    sidos: [],                 // [{code,name}]
    sigunguMap: {},            // { [areaCode]: [{code,name}] }
    loading: false,
    error: null,
    selected: { areaCode: "", sigunguCode: "" }, // 현재 선택
  },
  reducers: {
    setAreaSelection(state, action) {
      const { areaCode = "", sigunguCode = "" } = action.payload || {};
      state.selected.areaCode = areaCode;
      state.selected.sigunguCode = sigunguCode;
    },
    resetAreaSelection(state) {
      state.selected = { areaCode: "", sigunguCode: "" };
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchSidos.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchSidos.fulfilled, (s, a) => {
        s.loading = false;
        s.sidos = a.payload;
     })
     .addCase(fetchSidos.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

     .addCase(fetchSigungu.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(fetchSigungu.fulfilled, (s, a) => {
        s.loading = false;
        const { areaCode, list } = a.payload;
        s.sigunguMap[areaCode] = list;
     })
     .addCase(fetchSigungu.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; });
  },
});

export const { setAreaSelection, resetAreaSelection } = areaSlice.actions;
export default areaSlice.reducer;
