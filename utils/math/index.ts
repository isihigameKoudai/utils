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

/**
 * 中央値
 * @param arr
 * @returns
 */
export const median = (arr: number[]): number => {
  const sorted = arr.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted[middle];
};

/**
 * ベクトルの内積 (Dot Product) を計算します
 */
export const dotProduct = (a: number[], b: number[]): number => {
  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
};

/**
 * ベクトルのノルム (L2 Norm / 長さ) を計算します
 */
export const magnitude = (v: number[]): number => {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
};

/**
 * 2つのベクトルのコサイン類似度 (Cosine Similarity) を計算します
 * @returns 1に近いほど似ている、-1に近いほど似ていない
 */
export const cosineSimilarity = (a: number[], b: number[]): number => {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) {
    return 0; // ゼロベクトルの場合は0を返す
  }
  return dotProduct(a, b) / (magA * magB);
};
