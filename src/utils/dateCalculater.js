
export const dateCalculater = {
/**
 * timestamp만큼 과거의 날짜를 계산하여 Date 객체 반환
 * @param {number} timestamp 
 * @returns {Date} Date 객체 ('1000'*'60'*'60'*'24'*'30' = 한 달)
 */
  getPastDate: (timestamp) => {
    const now = new Date();
    return new Date(now - timestamp)
  }
}