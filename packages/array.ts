/**
 * 指定したsliceNumの数の配列に分割する
 *
 * example:
 * - splitMap([1,2,3,4,5], 2) => [[1,2],[3,4],[5]]
 * - splitMap([1,2,3,4,5], 5) => [[1,2,3,4,5]]
 * - splitMap([1,10, 100], 1) => [[1],[10],[100]]
 * @param originArray
 * @param sliceNum
 * @returns
 */
export const splitMap = (
  originArray: number[],
  sliceNum: number
): number[][] => {
  const array: number[][] = [];
  for (let i = 0; i * sliceNum < originArray.length; i++) {
    const currentIndex = i * sliceNum;
    const nextIndex = (i + 1) * sliceNum;
    const newArray = originArray.slice(currentIndex, nextIndex);
    array.push(newArray);
  }

  return array;
};
