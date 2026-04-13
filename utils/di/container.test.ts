import { describe, it, expect, beforeEach } from 'vitest';

import { Container } from './container';
import { createToken } from './modules';

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  describe('createToken', () => {
    it('一意な symbol を返す', () => {
      const t1 = createToken<string>('A');
      const t2 = createToken<string>('A');
      expect(t1).not.toBe(t2);
      expect(typeof t1).toBe('symbol');
    });
  });

  describe('register / resolve', () => {
    it('登録したファクトリーから値を解決できる', () => {
      const token = createToken<string>('Greeting');
      container.register(token, () => 'hello');
      expect(container.resolve(token)).toBe('hello');
    });

    it('ファクトリーにコンテナが渡され再帰的に依存解決できる', () => {
      const aToken = createToken<string>('A');
      const bToken = createToken<string>('B');

      container.register(aToken, () => 'value-a');
      container.register(bToken, (c) => `${c.resolve(aToken)}-and-b`);

      expect(container.resolve(bToken)).toBe('value-a-and-b');
    });

    it('未登録のトークンを resolve すると Error を投げる', () => {
      const token = createToken<string>('NotRegistered');
      expect(() => container.resolve(token)).toThrowError(/not registered/i);
    });
  });

  describe('lifetime: singleton', () => {
    it('同一インスタンスを返す', () => {
      const token = createToken<{ id: number }>('Obj');
      let callCount = 0;
      container.register(
        token,
        () => {
          callCount++;
          return { id: callCount };
        },
        'singleton',
      );

      const a = container.resolve(token);
      const b = container.resolve(token);

      expect(a).toBe(b);
      expect(callCount).toBe(1);
    });
  });

  describe('lifetime: transient', () => {
    it('毎回新しいインスタンスを返す', () => {
      const token = createToken<{ id: number }>('Obj');
      let callCount = 0;
      container.register(
        token,
        () => {
          callCount++;
          return { id: callCount };
        },
        'transient',
      );

      const a = container.resolve(token);
      const b = container.resolve(token);

      expect(a).not.toBe(b);
      expect(a.id).toBe(1);
      expect(b.id).toBe(2);
    });

    it('lifetime を省略すると transient になる', () => {
      const token = createToken<object>('Obj');
      container.register(token, () => ({}));

      const a = container.resolve(token);
      const b = container.resolve(token);

      expect(a).not.toBe(b);
    });
  });

  describe('resolveAll', () => {
    it('複数のトークンをまとめて解決できる', () => {
      const strToken = createToken<string>('Str');
      const numToken = createToken<number>('Num');

      container.register(strToken, () => 'hello');
      container.register(numToken, () => 42);

      const [str, num] = container.resolveAll(strToken, numToken);

      expect(str).toBe('hello');
      expect(num).toBe(42);
    });

    it('1つでも未登録のトークンがあれば Error を投げる', () => {
      const registered = createToken<string>('OK');
      const missing = createToken<string>('NG');
      container.register(registered, () => 'ok');

      expect(() => container.resolveAll(registered, missing)).toThrowError(
        /not registered/i,
      );
    });
  });

  describe('has', () => {
    it('登録済みのトークンには true を返す', () => {
      const token = createToken<string>('X');
      container.register(token, () => 'x');
      expect(container.has(token)).toBe(true);
    });

    it('未登録のトークンには false を返す', () => {
      const token = createToken<string>('Y');
      expect(container.has(token)).toBe(false);
    });
  });

  describe('clear', () => {
    it('全ての登録をクリアする', () => {
      const token = createToken<string>('Z');
      container.register(token, () => 'z', 'singleton');
      container.resolve(token);

      container.clear();

      expect(container.has(token)).toBe(false);
      expect(() => container.resolve(token)).toThrowError(/not registered/i);
    });
  });

  describe('登録の上書き', () => {
    it('同じトークンを再登録すると後の登録が優先される', () => {
      const token = createToken<string>('Overwrite');
      container.register(token, () => 'first');
      container.register(token, () => 'second');

      expect(container.resolve(token)).toBe('second');
    });
  });
});
