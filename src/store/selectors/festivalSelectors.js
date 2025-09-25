
import { createSelector } from 'reselect';
import { ListTitleLimit } from '../../utils/ListTitleLimit.js';

const selectFestivalList = (state) => state?.festival?.list ?? [];
const selectTitleLimit = () => 9;

export const selectFestivalListVM = createSelector(
  [selectFestivalList, selectTitleLimit],
  (list, limit) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      const title = item?.title ?? '';
      const short = ListTitleLimit(title, limit);
      return { ...item, shortTitle: short }; // ✅ shortTitle로 통일
    });
  }
);
