// src/store/slices/staySlice.js
import { createSlice } from "@reduxjs/toolkit";
import { stayIndex, stayCount } from "../thunks/stayThunk.js";
import {
  getStayList, setStayList, getStayPage, setStayPage,
  getStayScrollFlg, setStayScrollFlg,
} from "../../utils/localStorageUtil.js";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const staySlice = createSlice({
  name: "staySlice",
  initialState: {
    list: getStayList?.() ?? [],
    page: getStayPage?.() ?? 0, 
    totalCount: 0,         
    loading: false,         
    countLoading: false,    
    error: null,
    // 스크롤 가드 플래그 (중복 호출 방지)
    scrollEventFlg: (() => {
      const v = getStayScrollFlg?.();
      return typeof v === "boolean" ? v : true;
    })(),
  },
  reducers: {
      resetStay(state) {
    state.list = [];
    state.page = 0;
    state.totalCount = 0;
    state.loading = false;
    state.countLoading = false;
    state.error = null;
    state.scrollEventFlg = true;
    // 로컬스토리지도 동기화(선택)
    setStayList?.([]);
    setStayPage?.(0);
    setStayScrollFlg?.(true);
  },
  // 스크롤 가드 수동 토글이 필요할 때
  setScrollEventFlg(state, action) {
    state.scrollEventFlg = action.payload;
    setStayScrollFlg?.(action.payload);
  },
},
  extraReducers: (builder) => {
    builder
      // ========= stayCount: 총 개수만 가볍게 먼저 =========
      .addCase(stayCount.pending, (state) => {
        state.countLoading = true;
      })
      .addCase(stayCount.fulfilled, (state, action) => {
        state.countLoading = false;
        const n = toNum(action.payload);
        if (n > 0) {
          state.totalCount = n;
          // setStayTotalCount?.(n); // persist 원하면 사용
        }
      })
      .addCase(stayCount.rejected, (state) => {
        state.countLoading = false;
      })

      // ========= stayIndex: 리스트/페이지/스크롤 =========
      .addCase(stayIndex.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.scrollEventFlg = false; // 중복 호출 방지
      })
       // fulfilled: 데이터 처리
      .addCase(stayIndex.fulfilled, (state, action) => {
        const body = action.payload ?? {};
        const raw = body?.items?.item;
        const items = Array.isArray(raw) ? raw : (raw ? [raw] : []);

        if (items.length > 0) {
          // 리스트 누적
          state.list = [...(state.list ?? []), ...items];

          // 페이지 갱신
          state.page = toNum(body?.pageNo) || state.page || 1;

          // 총 개수 갱신(아직 세팅 안 됐을 때만)
          if (toNum(state.totalCount) === 0) {
            const total = toNum(body?.totalCount);
            if (total > 0) state.totalCount = total;
          }

          // 스크롤 가능
          state.scrollEventFlg = true;

          // 로컬스토리지 동기화 (유틸 있으면)
          setStayList?.(state.list);
          setStayPage?.(state.page);
          setStayScrollFlg?.(state.scrollEventFlg);
          // setStayTotalCount?.(state.totalCount);
        } else {
          // 더 이상 데이터 없음 → 스크롤 STOP
          state.scrollEventFlg = false;
          setStayScrollFlg?.(false);
        }

        state.loading = false;
      })
      .addCase(stayIndex.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || "요청 실패";
        state.scrollEventFlg = true; // 재시도 가능
        console.error("stayIndex 에러:", action.payload || action.error);
      });

    // 🔎 기존 addMatcher는 name prefix('staySlice/')에 매칭돼서
    // thunk('stay/index','stay/count')에는 안 걸렸음 → 위처럼 명시 addCase가 안전.
  },
});


export const {
   resetStay, setScrollEventFlg 
} = staySlice.actions;

export default staySlice.reducer;