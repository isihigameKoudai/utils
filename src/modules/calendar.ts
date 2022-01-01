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

  return Math.abs(
    differenceInDays(
      Date.UTC(start.year, start.month, start.day),
      Date.UTC(end.year, end.month, end.day)
    )
  );
};
