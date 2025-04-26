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
