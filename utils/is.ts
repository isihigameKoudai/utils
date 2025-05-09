/**
 * 値が関数かどうかをチェックする
 * 
 * @param value チェックする値
 * @returns 関数であればtrue、そうでなければfalse
 * 
 * @example
 * if (isFunction(maybeFunction)) {
 *   maybeFunction();
 * }
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * 値がPromiseを返す関数かどうかをチェックする
 * 
 * @param fn チェックする関数
 * @returns Promiseを返す関数であればtrue、そうでなければfalse
 * 
 * @example
 * if (isPromiseFunction(fn)) {
 *   const result = await fn();
 * }
 */
export function isPromiseFunction(fn: unknown): fn is (...args: any[]) => Promise<unknown> {
  if (!isFunction(fn)) {
    return false;
  }
  
  const fnStr = fn.toString();
  return fnStr.includes('new Promise') || fnStr.includes('async');
}

/**
 * 値がPromiseかどうかをチェックする
 * 
 * @param value チェックする値
 * @returns Promiseであればtrue、そうでなければfalse
 * 
 * @example
 * if (isPromise(maybePromise)) {
 *   maybePromise.then(result => console.log(result));
 * }
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (
    value !== null &&
    typeof value === 'object' &&
    'then' in value &&
    isFunction((value as any).then) &&
    'catch' in value &&
    isFunction((value as any).catch)
  );
}

/**
 * 値がエラーオブジェクトかどうかをチェックする
 * 
 * @param value チェックする値
 * @returns エラーオブジェクトであればtrue、そうでなければfalse
 * 
 * @example
 * if (isError(maybeError)) {
 *   console.error(maybeError.message);
 * }
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
} 

/**
 * 値が空かどうかをチェックする
 * 
 * @param {unknown} value - チェックする値
 * @returns {boolean} 空であればtrue、そうでなければfalse
 * 
 * @example
 * // 空と判定されるケース
 * isEmpty({}) // true
 * isEmpty([]) // true
 * isEmpty(new Set()) // true
 * isEmpty(new Map()) // true
 * isEmpty('') // true
 * isEmpty(0) // true
 * isEmpty(1) // true
 * isEmpty(true) // true
 * isEmpty(Symbol('abc')) // true
 * isEmpty(//) // true
 * isEmpty(new String('')) // true
 * isEmpty(new Boolean(true)) // true
 * isEmpty(null) // true
 * isEmpty(undefined) // true
 * 
 * @example
 * // 空と判定されないケース
 * isEmpty({a: 3, b: 5}) // false
 * isEmpty([1, 2]) // false
 * isEmpty(new Set([1, 2, 2])) // false
 * isEmpty((new Map()).set('a', 2)) // false
 * isEmpty('abc') // false
 * isEmpty(new String('abc')) // false
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string') {
    return value === '';
  }
  if (typeof value === 'number') {
    return value === 0;
  }
  if (typeof value === 'boolean') {
    return value === false;
  }
  if (typeof value === 'symbol') {
    return value === Symbol();
  }
  if (value instanceof String) {
    return value.toString() === '';
  }
  if (value instanceof Boolean) {
    return value.valueOf() === false;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (value instanceof Object) {
    return Object.keys(value).length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
}
