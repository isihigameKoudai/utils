/**
 * キャッシュされたPromiseを返す関数の型
 */
export interface CachePromiseReturn<T> {
  (): Promise<T>
  reset: () => Promise<void>
}

/**
 * deferred関数の戻り値の型
 */
export type DeferredOut<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

/**
 * コールバック関数の型定義
 * @template E エラーの型
 * @template R 結果の型（単一の値または配列）
 */
type NodeCallback<E = Error, R = unknown> = (err: E | null, ...values: R extends any[] ? R : [R]) => void;

/**
 * コールバックスタイルの関数の型
 */
export type CallbackStyleFunction<T = unknown, E = Error> = (...args: [...any[], NodeCallback<E, T>]) => unknown;

/**
 * Promiseを返す関数の型
 */
export type PromiseFunction<T = unknown> = (...args: any[]) => Promise<T>;

/**
 * 関数の引数の型を抽出する（最後のコールバック引数を除く）
 */
export type ArgumentsType<F> = 
  F extends (...args: [...infer A, any]) => any ? A : never; 
