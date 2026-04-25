/**
 * 型にブランドを付けるための型
 * @template T 型
 * @template Brand ブランド名
 * @example
 * type Yen = Branded<number, 'Yen'>;
 * const yen: Yen = 1000; // Error
 * const num: number = yen; // Error
 */
export type Branded<T, Brand = unknown> = T & {
  readonly __brand: Brand;
};
