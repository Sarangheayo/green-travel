// src/configs/keys.js
export const KEY_LOCALSTORAGE_FESTIVAL_LIST = "festivalList";
export const KEY_LOCALSTORAGE_FESTIVAL_PAGE = "festivalPage";
export const KEY_LOCALSTORAGE_FESTIVAL_FLG  = "festivalFlg";       // ✅ 호환 유지

export const KEY_LOCALSTORAGE_STAY_LIST = "stayList";
export const KEY_LOCALSTORAGE_STAY_PAGE = "stayPage";
export const KEY_LOCALSTORAGE_STAY_FLG  = "stayScrollFlg";

export const KEY_LOCALSTORAGE_CLEAR_DATE = "clearDate";

export const LS_KEYS = Object.freeze({
  FESTIVAL: {
    LIST: KEY_LOCALSTORAGE_FESTIVAL_LIST,
    PAGE: KEY_LOCALSTORAGE_FESTIVAL_PAGE,
    FLG:  KEY_LOCALSTORAGE_FESTIVAL_FLG,  // ✅ 위와 동일
  },
  STAY: {
    LIST: KEY_LOCALSTORAGE_STAY_LIST,
    PAGE: KEY_LOCALSTORAGE_STAY_PAGE,
    FLG:  KEY_LOCALSTORAGE_STAY_FLG,
  },
  APP: {
    CLEAR_DATE: KEY_LOCALSTORAGE_CLEAR_DATE,
  },
});
