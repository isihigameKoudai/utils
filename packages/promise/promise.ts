export interface CachePromiseReturn<T> {
  (): Promise<T>
  reset: () => Promise<void>
}

/**
 * キャッシュを利用したPromiseを作成する
 * @param fn 
 * @returns 
 */
export function createCachePromise<T>(fn: () => Promise<T>): CachePromiseReturn<T> {
  let _p: Promise<T> | undefined

  function wrapper() {
    if (!_p) {
      console.log('create cache promise');  
      _p = fn()
    }
    return _p
  }

  wrapper.reset = async () => {
    const _prev = _p;
    _p = undefined;

    if (_prev) {
      await _prev;
    }
  }

  return wrapper
}

export type DeferredOut<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

/**
 * resolveとrejectを任意のアクションで取り扱えるようにする
 * @example
 * const { promise, resolve, reject } = deferred<string>();
 * promise.then(console.log);
 * resolve('完了');
 */
export function deferred<T>(): DeferredOut<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

