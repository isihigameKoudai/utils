import { differenceInDays } from "date-fns";

import { divideDate } from "../../packages/date";

export const DAYS = [
  "日曜日",
  "月曜日",
  "火曜日",
  "水曜日",
  "木曜日",
  "金曜日",
  "土曜日",
];

export const subDates = (startDate: string, endDate: string) => {
  const start = divideDate(startDate);
  const end = divideDate(endDate);

  const date2 = +new Date(end.year, end.month, end.day);
  const date1 = +new Date(start.year, start.month, start.day);

  // return Math.abs((date2 - date1) / 86400000);
  return Math.abs(
    differenceInDays(
      Date.UTC(start.year, start.month, start.day),
      Date.UTC(end.year, end.month, end.day)
    )
  );
};
