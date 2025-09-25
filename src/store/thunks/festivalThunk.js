// src/store/thunks/festivalThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig.js";
import axios from "axios";
import { dateCalculater } from "../../utils/dateCalculater.js";
import { dateFormatter } from "../../utils/dateFormatter.js";

export const festivalIndex = createAsyncThunk(
  "festivalSlice/festivalIndex",
  async (arg = {}, thunkAPI) => {
    const state = thunkAPI.getState();
    // 최근 30일 이내 시작하는 축제
    const pastDateYMD = dateFormatter.formatDateToYMD(
      dateCalculater.getPastDate(1000 * 60 * 60 * 24 * 30)
    );
    const C = axiosConfig.COMMON;
    const url = `${C.BASE_URL}/searchFestival2`;
    const arrange = C.ARRANGE ?? "O";
    const numOfRows = C.NUM_OF_ROWS ?? 12;

    const params = {
      serviceKey: C.SERVICE_KEY,
      MobileOS: C.MOBILE_OS,
      MobileApp: C.MOBILE_APP,
      _type: C.TYPE,
      arrange,
      numOfRows,
      pageNo: (state?.festival?.page ?? 0) + 1,
      eventStartDate: pastDateYMD,
    };

    // ⬇️ 필터 동일 적용
    if (arg.areaCode) params.areaCode = arg.areaCode;
    if (arg.sigunguCode) params.sigunguCode = arg.sigunguCode;
    const { data } = await axios.get(url, { params });
    return data?.response?.body;
  }
);

export const festivalCount = createAsyncThunk(
  "festivalSlice/festivalCount",
  async (arg = {}, thunkAPI) => {
    try {
      const C = axiosConfig.COMMON;
      const url = `${C.BASE_URL}/searchFestival2`;
      const pastDateYMD = dateFormatter.formatDateToYMD(
        dateCalculater.getPastDate(1000 * 60 * 60 * 24 * 30)
      );

      const params = {
        serviceKey: C.SERVICE_KEY,
        MobileOS: C.MOBILE_OS,
        MobileApp: C.MOBILE_APP,
        _type: C.TYPE,
        arrange: "O",
        numOfRows: 1,
        pageNo: 1,
        eventStartDate: pastDateYMD,
      };

      // ⬇️ 필터 동일 적용
      if (arg.areaCode) params.areaCode = arg.areaCode;
      if (arg.sigunguCode) params.sigunguCode = arg.sigunguCode;

      const { data } = await axios.get(url, { params });
      return data?.response?.body?.totalCount ?? 0;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.response?.header?.resultMsg ||
          err?.message ||
          "searchFestival2(카운트) 요청 실패"
      );
    }
  }
);
