
import {
  KEY_LOCALSTORAGE_CLEAR_DATE,
  KEY_LOCALSTORAGE_FESTIVAL_FLG,
  KEY_LOCALSTORAGE_FESTIVAL_LIST,
  KEY_LOCALSTORAGE_FESTIVAL_PAGE,
  LS_KEYS,
} from "../configs/keys.js";

/** ---------- 기존 Festival 전용 유틸 (원본 유지) ---------- */
export const localStorageUtil = {
  clearLocalstorage: () => {
    localStorage.clear();
  },

  // FESTIVAL 리스트
  setFestivalList: (data) => {
    localStorage.setItem(KEY_LOCALSTORAGE_FESTIVAL_LIST, JSON.stringify(data));
  },
  getFestivalList: () => {
    try {
      const raw = localStorage.getItem(KEY_LOCALSTORAGE_FESTIVAL_LIST);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  // FESTIVAL 페이지
  setFestivalPage: (pageNo) => {
    localStorage.setItem(KEY_LOCALSTORAGE_FESTIVAL_PAGE, String(pageNo));
  },
  getFestivalPage: () => {
    const n = Number(localStorage.getItem(KEY_LOCALSTORAGE_FESTIVAL_PAGE));
    return Number.isFinite(n) && n > 0 ? n : 1;
  },

  // FESTIVAL 스크롤 플래그
  setFestivalScrollFlg: (flg) => {
    localStorage.setItem(KEY_LOCALSTORAGE_FESTIVAL_FLG, String(!!flg));
  },
  getFestivalScrollFlg: () => {
    const raw = localStorage.getItem(KEY_LOCALSTORAGE_FESTIVAL_FLG);
    return raw == null ? true : String(raw).toLowerCase() === "true";
  },

  // CLEAR_DATE
  setClearDate: (dateYMD) => {
    localStorage.setItem(KEY_LOCALSTORAGE_CLEAR_DATE, dateYMD);
  },
  getClearDate: () => {
    return localStorage.getItem(KEY_LOCALSTORAGE_CLEAR_DATE);
  },
};

/** ---------- 공용 세이프 헬퍼 + STAY 전용 ---------- */
const safeParse = (raw, fallback) => {
  try {
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
const safeGet = (key, fallback) => safeParse(localStorage.getItem(key), fallback);
const safeSet = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// STAY
export const getStayList = () => safeGet(LS_KEYS.STAY.LIST, []);
export const setStayList = (v) => safeSet(LS_KEYS.STAY.LIST, v);

export const getStayPage = () => {
 const n = Number(safeGet(LS_KEYS.STAY.PAGE, 0));
 return Number.isFinite(n) && n >= 0 ? n : 0; 
};
export const setStayPage = (v) => safeSet(LS_KEYS.STAY.PAGE, v);

export const getStayScrollFlg = () => {
  const b = safeGet(LS_KEYS.STAY.FLG, true);
  return typeof b === "boolean" ? b : String(b).toLowerCase() === "true";
};
export const setStayScrollFlg = (v) => safeSet(LS_KEYS.STAY.FLG, !!v);
