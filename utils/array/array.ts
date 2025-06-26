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
 * ex: sortByKey([
 *  { key: 'a', value: 1 },
 *  { key: 'b', value: 2 },
 *  { key: 'a', value: 3, foo: 'bar' }
 * ], 'key')
 * => [
 *  { key: 'a', value: 1 },
 *  { key: 'a', value: 3, foo: 'bar' },
 *  { key: 'b', value: 2 }
 * ]
 */
export type ListItem = { key: string; value: number };
export const sortByKey = <T = any>(arr: T[], key: keyof T, order: 'desc' | 'asc'): T[] => {  
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
 * 同じkeyのvalueを合計し、keyごとに並び替えをする
 * 
 * ex: sumByKey([
 *  { text: 'a', amount: 1, num: 10 },
 *  { text: 'b', amount: 2, num: 10 },
 *  { text: 'a', amount: 3, num: 10 }
 * ], {
 *  orderKey: 'text',
 *  numKey: 'amount'
 * })
 * => [
 *  { text: 'a', amount: 4 },
 *  { text: 'b', amount: 2 }
 * ]
 */
export const sumByKey = <T = any>(
  array: T[],
  { orderKey, numKey }: { orderKey: keyof T, numKey: keyof T }
): {
  [key in string]: T[keyof T] | number;
}[] => {
  // キーごとの合計を格納するMapを作成
  const sumMap = new Map<string, number>();
  
  // 各要素を処理して合計を計算
  array.forEach((item) => {
    const key = String(item[orderKey]);
    const value = Number(item[numKey]);
    
    if (!Number.isNaN(value)) {
      const currentSum = sumMap.get(key) || 0;
      sumMap.set(key, currentSum + value);
    }
  });

  // Mapを配列に変換し、キーでソート
  return Array.from(sumMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      [String(orderKey)]: key as T[keyof T],
      [String(numKey)]: value as number
    }));
}
