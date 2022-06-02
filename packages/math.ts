/**
 * 合計
 * @param arr
 * @returns
 */
export const sum = (arr: number[]): number =>
  arr.reduce((sum, current) => sum + current);

/**
 * 平均
 * @param arr
 * @returns
 */
export const average = (arr: number[]): number => sum(arr) / arr.length;

/**
 * 分散
 * @param arr
 * @returns
 */
export const variance = (arr: number[]): number => {
  const avg = average(arr);
  return sum(arr.map((num) => Math.pow(num - avg, 2))) / arr.length;
};

/**
 * 標準偏差
 * @param arr
 * @returns
 */
export const deviation = (arr: number[]): number => Math.sqrt(variance(arr));
