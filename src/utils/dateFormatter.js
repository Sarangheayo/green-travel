
export const dateFormatter = {
    /** 
   * 스트링 타입의 날짜(YYYYMMDD ~ YYYYMMDDhhmiss)를 `YYYY-MM-DD` 로 포멧해서 반환
   * @param {string} strDate
   * @returns {string} YYYY-MM-DD 포멧
   */
  withHyphenYMD: (strDate) => {
     return `${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`;
  }
}