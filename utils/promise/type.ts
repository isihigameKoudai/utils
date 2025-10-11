/**
 * キャッシュされたPromiseを返す関数の型
 */
export interface CachePromiseReturn<T> {
  (): Promise<T>;
  reset: () => Promise<void>;
}

/**
 * deferred関数の戻り値の型
 */
export type DeferredOut<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
};
