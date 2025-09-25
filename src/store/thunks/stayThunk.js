import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosConfig from '../../configs/axiosConfig.js';

// 숙박 목록 가져오기
export const stayIndex = createAsyncThunk(
  'staySlice/stayIndex',
  async (arg = {}, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const nextPage = (state?.stay?.page ?? 0) + 1;

      const C = axiosConfig.COMMON;
      const S = axiosConfig.STAY;
      const url = `${C.BASE_URL}/searchStay2`;

      const params = {
        serviceKey: C.SERVICE_KEY,
        MobileOS:   C.MOBILE_OS,
        MobileApp:  C.MOBILE_APP,
        _type:      C.TYPE,            // 'json'
        arrange:    S.ARRANGE ?? 'O',  // 제목순
        numOfRows:  S.NUM_OF_ROWS ?? 12,
        pageNo:     arg.pageNo ?? nextPage,
        cat1:       arg.cat1 ?? 'B02', // 숙박 대분류 기본
      };

      // 선택 필터(넘어온 것만)
      if (arg.areaCode)    params.areaCode = arg.areaCode;
      if (arg.sigunguCode) params.sigunguCode = arg.sigunguCode;
      if (arg.cat2)        params.cat2 = arg.cat2;
      if (arg.cat3)        params.cat3 = arg.cat3;
      if (arg.l1)          params.lclsSystm1 = arg.l1;
      if (arg.l2)          params.lclsSystm2 = arg.l2;
      if (arg.l3)          params.lclsSystm3 = arg.l3;
      if (arg.dongSiDo)    params.IDongRegnCd = arg.dongSiDo;
      if (arg.dongSiGunGu) params.IDongSigunguCd = arg.dongSiGunGu;

      const { data } = await axios.get(url, { params });
      return data?.response?.body; // 슬라이스에서 items.item 파싱
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.response?.header?.resultMsg ||
        err?.message ||
        'searchStay2 요청 실패'
      );
    }
  }
);

// 총 개수만 빠르게 가져오기(슬라이스에서 toNum(payload)로 받음)
export const stayCount = createAsyncThunk(
  'staySlice/stayCount',
  async (arg = {}, thunkAPI) => {
    try {
      const C = axiosConfig.COMMON;
      const S = axiosConfig.STAY;
      const url = `${C.BASE_URL}/searchStay2`;

      const params = {
        serviceKey: C.SERVICE_KEY,
        MobileOS:   C.MOBILE_OS,
        MobileApp:  C.MOBILE_APP,
        _type:      C.TYPE,
        arrange:    S.ARRANGE ?? 'O',
        numOfRows:  1,      // 최소 호출
        pageNo:     1,
        cat1:       arg.cat1 ?? 'B02',
      };

      // stayIndex와 동일한 선택 필터를 맞춰야 같은 totalCount가 옴
      if (arg.areaCode)    params.areaCode = arg.areaCode;
      if (arg.sigunguCode) params.sigunguCode = arg.sigunguCode;
      if (arg.cat2)        params.cat2 = arg.cat2;
      if (arg.cat3)        params.cat3 = arg.cat3;
      if (arg.l1)          params.lclsSystm1 = arg.l1;
      if (arg.l2)          params.lclsSystm2 = arg.l2;
      if (arg.l3)          params.lclsSystm3 = arg.l3;
      if (arg.dongSiDo)    params.IDongRegnCd = arg.dongSiDo;
      if (arg.dongSiGunGu) params.IDongSigunguCd = arg.dongSiGunGu;

      const { data } = await axios.get(url, { params });
      const body = data?.response?.body;
      // 슬라이스에서 toNum(action.payload)로 처리하므로 숫자/문자 그대로 반환
      return body?.totalCount ?? 0;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.response?.header?.resultMsg ||
        err?.message ||
        'searchStay2(카운트) 요청 실패'
      );
    }
  }
);
