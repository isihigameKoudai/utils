type DivideDate = (date: string) => {
  year: number;
  month: number;
  day: number;
};

/**
 *
 * @param date yyyyMMdd
 * @returns object of year,month,day
 */
export const divideDate: DivideDate = (date) => {
  if (date.length !== 8)
    return {
      year: 0,
      month: 0,
      day: 0,
    };
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(4, 6));
  const day = Number(date.slice(6, 8));

  return {
    year,
    month,
    day,
  };
};
