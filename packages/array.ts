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

/**
 * 適当な配列からダブりと欠損を排除してからnumber[]として出力
 * ex: unique([9,2,3,5,2,1,5,'1','10']) => [9,2,3,5,1,10]
 */
export const unique = (arr: (number | string | undefined)[]) => [
  ...new Set(
    arr
      .map((item) => Number(item))
      .filter((item) => item !== undefined && !Number.isNaN(item))
  ),
];

/**
 * keyごとに並び替えをする
 * 指定したkeyで並び替えをする
 * ex: [
 *  { key: 'a', value: 1 },
 *  { key: 'b', value: 2 },
 *  { key: 'a', value: 3, foo: 'bar' }
 * ]
 * => [
 *  { key: 'a', value: 1 },
 *  { key: 'a', value: 3, foo: 'bar' },
 *  { key: 'b', value: 2 }
 * ]
 */
type ListItem = { key: string; value: number };
export const sortByKey = <T extends ListItem>(arr: T[],orderKey?: keyof T, orderOrigin?: 'desc' | 'asc'): T[] => {
  const key = orderKey || 'key';
  const order = orderOrigin || 'desc';
  
  return arr.sort((a, b) => {
    if (a[key] < b[key]) {
      return order === 'desc' ? 1 : -1;
    }
    if (a[key] > b[key]) {
      return order === 'desc' ? -1 : 1;
    }
    return 0;
  });
}

/**
 * keyごとに並び替えをし、同じkeyのvalueを合計する
 * 
 * ex: [
 *  { key: 'a', value: 1 },
 *  { key: 'b', value: 2 },
 *  { key: 'a', value: 3 }
 * ]
 * => [
 *  { key: 'a', value: 4 },
 *  { key: 'b', value: 2 }
 * ]
 */
export const sumByKey = (array: ListItem[]): ListItem[] => {
  const map = new Map<string, number>();
  array.forEach((item) => {
    const currentValue = map.get(item.key) || 0;
    map.set(item.key, currentValue + item.value);
  });

  return Array.from(map).map(([key, value]) => ({ key, value }));
}
