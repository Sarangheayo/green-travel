import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosConfig from "../../configs/axiosConfig.js";

// 시/도 목록 (KTO KorService2: areaCode2)
export const fetchSidos = createAsyncThunk(
  "area/fetchSidos",
  async (_, { rejectWithValue }) => {
    try {
      const C = axiosConfig.COMMON;
      const url = `${C.BASE_URL}/areaCode2`;
      const params = {
        serviceKey: C.SERVICE_KEY,
        MobileOS: C.MOBILE_OS,
        MobileApp: C.MOBILE_APP,
        _type: C.TYPE, // 'json'
        numOfRows: 100, // 충분히 크게
      };
      const { data } = await axios.get(url, { params });
      const items = data?.response?.body?.items?.item ?? [];
      // [{code:1,name:'서울특별시'}, ...]
      return items.map((x) => ({ code: String(x.code), name: String(x.name) }));
    } catch (err) {
      return rejectWithValue(err?.message || "fetchSidos 실패");
    }
  }
);

// 시/도 선택 후 시군구 목록
export const fetchSigungu = createAsyncThunk(
  "area/fetchSigungu",
  async (areaCode, { rejectWithValue }) => {
    try {
      const C = axiosConfig.COMMON;
      const url = `${C.BASE_URL}/areaCode2`;
      const params = {
        serviceKey: C.SERVICE_KEY,
        MobileOS: C.MOBILE_OS,
        MobileApp: C.MOBILE_APP,
        _type: C.TYPE,
        areaCode,         // ★ 시/도 코드 전달
        numOfRows: 500,   // 여유
      };
      const { data } = await axios.get(url, { params });
      const items = data?.response?.body?.items?.item ?? [];
      // [{code: '1', name: '종로구'}, ...]
      return {
        areaCode: String(areaCode),
        list: items.map((x) => ({ code: String(x.code), name: String(x.name) })),
      };
    } catch (err) {
      return rejectWithValue(err?.message || "fetchSigungu 실패");
    }
  }
);
