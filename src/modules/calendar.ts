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

export const OPEN_HOURS = 9 as const;
export const TIMES = [...new Array(12)].map((_, i) => i + OPEN_HOURS);
export const HOURS = [...new Array(24)].map((_, i) => i);

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

export const colorBy = (sales: number): string => {
  if (50000 < sales) return "#B71C1C";
  if (45000 < sales) return "#C62828";
  if (40000 < sales) return "#D32F2F";
  if (35000 < sales) return "#E53935";
  if (30000 < sales) return "#F44336";
  if (25000 < sales) return "#EF5350";
  if (20000 < sales) return "#E57373";
  if (15000 < sales) return "#EF9A9A";
  if (10000 < sales) return "#FFCDD2";
  if (5000 < sales) return "#FFEBEE";

  return "#fff";
};

export const timelyColorBy = (sales: number) => {
  if (10000 < sales) return "#B71C1C";
  if (9000 < sales) return "#C62828";
  if (8000 < sales) return "#D32F2F";
  if (7000 < sales) return "#E53935";
  if (6000 < sales) return "#F44336";
  if (5000 < sales) return "#EF5350";
  if (4000 < sales) return "#E57373";
  if (3000 < sales) return "#EF9A9A";
  if (2000 < sales) return "#FFCDD2";
  if (1000 < sales) return "#FFEBEE";

  return "#fff";
};
