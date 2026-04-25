import * as v from 'valibot';
import { describe, it, expect } from 'vitest';

import { createModelFactory } from './createModel';

describe('createModelFactory', () => {
  const userSchema = v.object({
    id: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    age: v.pipe(v.number(), v.minValue(0)),
  });

  type UserParams = v.InferOutput<typeof userSchema>;

  type User = UserParams & {
    readonly fullName: string;
    readonly isAdult: boolean;
    readonly greet: () => string;
  };

  describe('基本的なモデル生成', () => {
    it('スキーマに基づいてモデルを生成できる（拡張なし）', () => {
      const createUser = createModelFactory<UserParams>({
        schema: userSchema,
      });

      const user = createUser({
        id: '1',
        firstName: 'Taro',
        lastName: 'Yamada',
        age: 25,
      });

      expect(user.id).toBe('1');
      expect(user.firstName).toBe('Taro');
      expect(user.lastName).toBe('Yamada');
      expect(user.age).toBe(25);
    });

    it('拡張プロパティを含むモデルを生成できる', () => {
      const createUser = createModelFactory<UserParams, User>({
        schema: userSchema,
        extension: (params) => ({
          get fullName() {
            return `${params.firstName} ${params.lastName}`;
          },
          get isAdult() {
            return params.age >= 18;
          },
          greet() {
            return `Hello, I'm ${params.firstName}!`;
          },
        }),
      });

      const user = createUser({
        id: '1',
        firstName: 'Taro',
        lastName: 'Yamada',
        age: 25,
      });

      expect(user.fullName).toBe('Taro Yamada');
      expect(user.isAdult).toBe(true);
      expect(user.greet()).toBe("Hello, I'm Taro!");
    });

    it('未成年の場合isAdultがfalseになる', () => {
      const createUser = createModelFactory<UserParams, User>({
        schema: userSchema,
        extension: (params) => ({
          get fullName() {
            return `${params.firstName} ${params.lastName}`;
          },
          get isAdult() {
            return params.age >= 18;
          },
          greet() {
            return `Hello, I'm ${params.firstName}!`;
          },
        }),
      });

      const user = createUser({
        id: '2',
        firstName: 'Jiro',
        lastName: 'Suzuki',
        age: 15,
      });

      expect(user.isAdult).toBe(false);
    });
  });

  describe('イミュータビリティ', () => {
    it('プロパティを変更しようとするとエラーになる', () => {
      const createUser = createModelFactory<UserParams>({
        schema: userSchema,
      });

      const user = createUser({
        id: '1',
        firstName: 'Taro',
        lastName: 'Yamada',
        age: 25,
      });

      expect(() => {
        (user as unknown as { age: number }).age = 30;
      }).toThrow();
    });

    it('ネストされたオブジェクトも不変である', () => {
      const nestedSchema = v.object({
        id: v.string(),
        address: v.object({
          city: v.string(),
          zip: v.string(),
        }),
      });

      type NestedParams = v.InferOutput<typeof nestedSchema>;

      const createEntity = createModelFactory<NestedParams>({
        schema: nestedSchema,
      });

      const entity = createEntity({
        id: '1',
        address: {
          city: 'Tokyo',
          zip: '100-0001',
        },
      });

      expect(() => {
        (entity.address as { city: string }).city = 'Osaka';
      }).toThrow();
    });

    it('配列も不変である', () => {
      const arraySchema = v.object({
        id: v.string(),
        tags: v.array(v.string()),
      });

      type ArrayParams = v.InferOutput<typeof arraySchema>;

      const createEntity = createModelFactory<ArrayParams>({
        schema: arraySchema,
      });

      const entity = createEntity({
        id: '1',
        tags: ['a', 'b', 'c'],
      });

      expect(() => {
        (entity.tags as string[]).push('d');
      }).toThrow();
    });
  });

  describe('Valibotバリデーション', () => {
    it('不正なパラメータに対してエラーをスローする', () => {
      const createUser = createModelFactory<UserParams>({
        schema: userSchema,
      });

      expect(() => {
        createUser({
          id: '1',
          firstName: 'Taro',
          lastName: 'Yamada',
          age: -1,
        });
      }).toThrow();
    });

    it('必須フィールドが欠けている場合エラーをスローする', () => {
      const createUser = createModelFactory<UserParams>({
        schema: userSchema,
      });

      expect(() => {
        createUser({
          id: '1',
          firstName: 'Taro',
          age: 25,
        } as UserParams);
      }).toThrow();
    });

    it('型が不正な場合エラーをスローする', () => {
      const createUser = createModelFactory<UserParams>({
        schema: userSchema,
      });

      expect(() => {
        createUser({
          id: '1',
          firstName: 'Taro',
          lastName: 'Yamada',
          age: '25',
        } as unknown as UserParams);
      }).toThrow();
    });
  });

  describe('型推論と差分計算', () => {
    it('extensionはTModelとTParamsの差分のみを返す', () => {
      type SimpleUser = UserParams & {
        readonly fullName: string;
      };

      const createUser = createModelFactory<UserParams, SimpleUser>({
        schema: userSchema,
        extension: (params) => ({
          get fullName() {
            return `${params.firstName} ${params.lastName}`;
          },
        }),
      });

      const user = createUser({
        id: '1',
        firstName: 'Taro',
        lastName: 'Yamada',
        age: 25,
      });

      expect(user.fullName).toBe('Taro Yamada');
      expect(user.age).toBe(25);
    });

    it('拡張なしでもモデルを作成できる', () => {
      const createUser = createModelFactory<UserParams>({
        schema: userSchema,
      });

      const user = createUser({
        id: '1',
        firstName: 'Taro',
        lastName: 'Yamada',
        age: 25,
      });

      expect(user.id).toBe('1');
      expect(user.firstName).toBe('Taro');
    });
  });
});
