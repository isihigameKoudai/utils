import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createCachePromise, deferred } from './promise';

describe('promise utils', () => {
  describe('createCachePromise', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should cache promise result', async () => {
      const mockFn = vi.fn().mockResolvedValue('test');
      const cachedPromise = createCachePromise(mockFn);

      const result1 = await cachedPromise();
      const result2 = await cachedPromise();

      expect(result1).toBe('test');
      expect(result2).toBe('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset cache when reset is called', async () => {
      const mockFn = vi.fn().mockResolvedValue('test');
      const cachedPromise = createCachePromise(mockFn);

      await cachedPromise();
      await cachedPromise.reset();
      await cachedPromise();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should wait for previous promise to complete before reset', async () => {
      let resolveFirst: (value: string) => void;
      const mockFn = vi.fn().mockImplementation(() => {
        return new Promise<string>((resolve) => {
          resolveFirst = resolve;
        });
      });

      const cachedPromise = createCachePromise(mockFn);
      const firstPromise = cachedPromise();

      const resetPromise = cachedPromise.reset();
      resolveFirst!('test');

      await Promise.all([firstPromise, resetPromise]);
      expect(await firstPromise).toBe('test');
    });

    it.todo('handles rejected promises', async () => {
      // type TestError = { message: string };
      // const testError: TestError = { message: 'test error' };
      // const mockFn = vi.fn().mockRejectedValue(testError);
      // const cachedPromise = createCachePromise(mockFn);
      // try {
      //   await cachedPromise();
      // } catch (error) {
      //   expect(error).toEqual(testError);
      // }
      // await cachedPromise.reset();
      // try {
      //   await cachedPromise();
      // } catch (error) {
      //   expect(error).toEqual(testError);
      // }
      // expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('deferred', () => {
    it('should resolve with provided value', async () => {
      const { promise, resolve } = deferred<string>();
      resolve('test');
      await expect(promise).resolves.toBe('test');
    });

    it('should reject with provided reason', async () => {
      const { promise, reject } = deferred<string>();
      reject('test error');
      await expect(promise).rejects.toBe('test error');
    });

    it('should handle async resolve', async () => {
      const { promise, resolve } = deferred<string>();
      setTimeout(() => resolve('test'), 0);
      await expect(promise).resolves.toBe('test');
    });

    it('should handle promise-like values', async () => {
      const { promise, resolve } = deferred<string>();
      resolve(Promise.resolve('test'));
      await expect(promise).resolves.toBe('test');
    });

    it('should maintain promise state after resolution', async () => {
      const { promise, resolve } = deferred<string>();
      resolve('test');
      const result1 = await promise;
      const result2 = await promise;
      expect(result1).toBe('test');
      expect(result2).toBe('test');
    });
  });
});
