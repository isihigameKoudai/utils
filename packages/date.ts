type DivideDate = (date: string) => {
  year: number;
  month: number;
  day: number;
  hour?: number;
};

/**
 *
 * @param date yyyyMMdd
 * @returns object of year,month,day
 */
export const divideDate: DivideDate = (date) => {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(4, 6));
  const day = Number(date.slice(6, 8));
  const hour = Number(date.slice(8, 10));

  return {
    year,
    month,
    day,
    hour,
  };
};
