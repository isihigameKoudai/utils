/**
 * 値がnullishでない（nullまたはundefinedでない）かどうかをチェックします。
 * このガード関数は型の絞り込みにも使用できます。```
 */
export const notNullish = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

/**
 * null値を除外するための型ガード
 *
 * @example array.filter(noNull)
 */
export function noNull<T>(value: T | null): value is Exclude<T, null> {
  return value !== null;
}

/**
 * undefined値を除外するための型ガード関数
 */
export function notUndefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

/**
 * falsy値（false, 0, "", null, undefined, NaN）を除外するための型ガード関数
 *
 * @param value - チェックする値
 * @returns 値がtruthyの場合true
 * @category Guards
 * @example array.filter(isTruthy)
 */
export function isTruthy<T>(value: T): value is NonNullable<T> {
  return Boolean(value);
}
