import { CachePromiseReturn, DeferredOut, NodeCallback } from './type';

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

/**
 * Node.jsのutil.promisifyをラップした関数
 * 引数の最後にコールバック関数を取る関数をPromise化する
 * コールバック関数の最初の引数がエラーである場合に対応
 * 既にPromiseを返す関数の場合はそのまま返す
 * 
 * @template T 戻り値の型
 * @template Args 引数の型の配列
 * @template E エラーの型
 * 
 * @example
 * // 標準的なNodeスタイルのコールバック
 * const readFilePromise = promisify<Buffer, [string, string]>(fs.readFile);
 * const data = await readFilePromise('file.txt', 'utf8');
 * 
 * @example
 * // 既にPromiseを返す関数はそのまま
 * const alreadyPromise = promisify(async (num: number) => `Result: ${num}`);
 * const result = await alreadyPromise(42);
 * 
 * @param fn コールバックスタイルの関数またはPromiseを返す関数
 * @returns Promiseを返す関数
 */
export function promisify<T = unknown, Args extends readonly unknown[] = readonly unknown[], E = Error>(
  fn: ((...args: [...Args, NodeCallback<E, T>]) => unknown) | ((...args: Args) => Promise<T>)
): (...args: Args) => Promise<T> {
  if (typeof fn !== 'function') {
    throw new TypeError('引数には関数を指定してください');
  }
  
  // 既にPromiseを返す関数の場合はそのまま返す
  if (fn.toString().includes('new Promise') || fn.toString().includes('async')) {
    return fn as unknown as (...args: Args) => Promise<T>;
  }
  
  return function(this: unknown, ...args: Args): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const callback = (err: E | null, ...values: unknown[]) => {
        if (err) {
          reject(err);
        } else {
          // 単一の値を返す場合は最初の値を、それ以外の場合は配列を返す
          if (values.length <= 1) {
            resolve(values[0] as T);
          } else {
            resolve(values as unknown as T);
          }
        }
      };
      
      try {
        fn.call(this, ...args, callback);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  };
}
