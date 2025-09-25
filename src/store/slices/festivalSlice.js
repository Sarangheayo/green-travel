import { createSlice } from "@reduxjs/toolkit";
import { festivalIndex, festivalCount } from "../thunks/festivalThunk.js";
import { localStorageUtil } from "../../utils/localStorageUtil.js";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const festivalSlice = createSlice({
  name: "festivalSlice",
  initialState: {
    list: localStorageUtil.getFestivalList() ?? [],
    page: localStorageUtil.getFestivalPage() ?? 0,
    scrollEventFlg: (() => {
      const v = localStorageUtil.getFestivalScrollFlg();
      return typeof v === "boolean" ? v : true;
    })(),
    totalCount: 0,
    loading: false,
    countLoading: false,
    error: null,
  },
  reducers: {
    setScrollEventFlg: (state, action) => {
      state.scrollEventFlg = action.payload;
    },
    // ✅ Stay와 동일: 필터 바꿀 때 초기화
    resetFestival(state) {
      state.list = [];
      state.page = 0;
      state.totalCount = 0;
      state.loading = false;
      state.countLoading = false;
      state.error = null;
      state.scrollEventFlg = true;

      localStorageUtil.setFestivalList([]);
      localStorageUtil.setFestivalPage(0);
      localStorageUtil.setFestivalScrollFlg(true);
    },
  },
  extraReducers: (b) => {
    b.addCase(festivalCount.pending, (s) => { s.countLoading = true; })
     .addCase(festivalCount.fulfilled, (s, a) => {
        s.countLoading = false;
        const n = toNum(a.payload);
        if (n > 0) s.totalCount = n;
     })
     .addCase(festivalCount.rejected, (s) => { s.countLoading = false; })

     .addCase(festivalIndex.pending, (s) => {
        s.loading = true; s.error = null; s.scrollEventFlg = false;
     })
     .addCase(festivalIndex.fulfilled, (s, a) => {
        const body = a.payload ?? {};
        const raw = body?.items?.item;
        const items = Array.isArray(raw) ? raw : (raw ? [raw] : []);

        if (items.length > 0) {
          s.list = [...(s.list ?? []), ...items];
          s.page = toNum(body?.pageNo) || s.page || 1;

          if (toNum(s.totalCount) === 0) {
            const total = toNum(body?.totalCount);
            if (total > 0) s.totalCount = total;
          }

          s.scrollEventFlg = true;

          localStorageUtil.setFestivalList(s.list);
          localStorageUtil.setFestivalPage(s.page);
          localStorageUtil.setFestivalScrollFlg(s.scrollEventFlg);
        } else {
          s.scrollEventFlg = false;
          localStorageUtil.setFestivalScrollFlg(false);
        }

        s.loading = false;
     })
     .addCase(festivalIndex.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error || "요청 실패";
        s.scrollEventFlg = true;
        console.error("festivalIndex 에러:", s.error);
     });
  },
});

export const { setScrollEventFlg, resetFestival } = festivalSlice.actions;
export default festivalSlice.reducer;
