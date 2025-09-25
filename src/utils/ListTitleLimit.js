// festival list tilte의 제목 표기 제한 util 제작 -> 적용 
export function ListTitleLimit(title, limit = 9) { // 제목 9자 이상이면 '...' 으로 표기
  if (!title) return '';
  return title.length > limit ? title.slice(0, limit) + '…' : title; 
}
