import { createSlice } from "@reduxjs/toolkit";
import { festivalIndex } from "../thunks/festivalThunk.js";

const festivalSlice = createSlice({
  name: 'festivalSlice',
  initialState: {
   list: [],   // 페스티벌 리스트 
   page: 1, // 현재 페이지 번호
   scrollEventFlg: true, // 스크롤 이벤트 디바운싱 제어 플래그

  },
  reducers:{
    setScrollEventFlg: (state, action) => {
      state.scrollEventFlg = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(festivalIndex.fulfilled, (state, action) => {
        // console.log(action.payload, action.type);
          // // 페이지 추가 처리
          // state.list = [...state.list, ...action.payload.items.item];
          // state.page = 1;
          // // 초기 페이지 처리       

      if(action.payload.items?.item) {

          state.list = [...state.list, ...action.payload.items.item];
          state.page = action.payload.pageNo;
          state.scrollEventFlg = true; 
        } else {
          state.scrollEventFlg = false;
        }  
        
      })
      .addMatcher(
        action => action.type.endsWith('/pending'),
        (state) => {
          console.log('처리중입니다'); 
        }
      )
      .addMatcher(
        action => action.type.endsWith('/rejected'),
        (state, action) => {
          console.error('에러에러 삐용삐용', action.error); 
        }
      );
  }
});


export const {
  setScrollEventFlg
} = festivalSlice.actions;

export default festivalSlice.reducer;


