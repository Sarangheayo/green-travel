import { createSelector } from "reselect";
import { ListTitleLimit } from "../../utils/ListTitleLimit"; 

const selectStayList = (state) => state?.stay?.list ?? [];
const selectTitleLimit = () => 9;

export const selectStayListVM = createSelector(
  [selectStayList, selectTitleLimit],
  (list, limit) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => {
      const title = item?.title ?? "";
      const short = ListTitleLimit(title, limit);
      return { ...item, shortTitle: short };
    });
  }
);
