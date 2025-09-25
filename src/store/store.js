import { configureStore } from "@reduxjs/toolkit";
import festivalReducer from './slices/festivalSlice.js';
import festivalShowReducer from './slices/festivalShowSlice.js';
import stayReducer from "./slices/staySlice.js";
import stayShowReducer from "./slices/stayShowSlice.js";
import areaReducer from "./slices/areaSlice.js";


// 루트 리듀서 설정
export default configureStore({
   // 각 슬라이스 리듀서 등록
    reducer: {
      festival: festivalReducer,
      festivalShow: festivalShowReducer,
      stay: stayReducer,
      stayShow: stayShowReducer,
      area: areaReducer,
    }
  });