---
name: domain-model
description: Create immutable Domain Models using createModelFactory with Zod validation, computed properties, and type-safe transformations. Follows DDD principles adapted for frontend React applications.
---

# Domain Model Development Guide

`createModelFactory`を使用したイミュータブルなDomain Modelの設計と実装ガイド。DDDプリンシプルをフロントエンドReactアプリケーションに最適化したパターンを提供する。

## Core Principles

### 1. Immutability

- `createModelFactory`は自動で`Object.freeze`を適用
- プロパティは全てreadonly
- 更新は新しいオブジェクトを返すメソッドで

### 2. Validation

- Zodスキーマによるランタイムバリデーション
- 不正なデータでのインスタンス化を防止
- 明確なエラーメッセージ

### 3. Rich Behavior

- extensionでgetterを定義（計算プロパティ）
- メソッドでビジネスロジックを公開
- 静的メソッド相当は外部関数として定義

## Model Structure

### Directory Structure

```
models/
└── {entity}/
    ├── index.ts      # re-export
    ├── scheme.ts     # Zod schema definition
    ├── types.ts      # Params & Model type definitions
    └── model.ts      # createModelFactory implementation
```

### Step 1: Zod Schema Definition

```typescript
// models/{entity}/scheme.ts
import { z } from 'zod';

/** @description Entity validation schema */
export const entitySchema = z.object({
  id: z.string().min(1, 'id is required'),
  name: z.string().min(1, 'name is required'),
  status: z.enum(['active', 'inactive', 'pending']),
  amount: z.number().min(0, 'amount must be non-negative'),
  createdAt: z.string().datetime({ message: 'Invalid date format' }),
  updatedAt: z.string().datetime({ message: 'Invalid date format' }),
});
```

### Step 2: Types Definition

```typescript
// models/{entity}/types.ts
import type { z } from 'zod';
import type dayjs from 'dayjs';

import type { entitySchema } from './scheme';

/** @description Raw params type (store/API用) */
export type EntityParams = z.infer<typeof entitySchema>;

/** @description Status type */
export type EntityStatus = EntityParams['status'];

/**
 * Entity Model type
 * @description EntityParams + computed properties + methods
 */
export type Entity = EntityParams & {
  /** @description 表示用金額（カンマ区切り） */
  readonly amountLabel: string;
  /** @description 表示用日付 */
  readonly createdAtLabel: string;
  /** @description アクティブかどうか */
  readonly isActive: boolean;
  /** @description 保留中かどうか */
  readonly isPending: boolean;
  /** @description ステータスのラベル */
  readonly statusLabel: string;
  /** @description 作成からの経過日数 */
  readonly daysSinceCreation: number;
  /** @description dayjs形式のcreatedAt */
  readonly createdAtDayjs: dayjs.Dayjs;
  /** @description dayjs形式のupdatedAt */
  readonly updatedAtDayjs: dayjs.Dayjs;
  /** @description ステータス更新後のパラメータを返す */
  withStatus: (status: EntityStatus) => EntityParams;
  /** @description 金額更新後のパラメータを返す */
  withAmount: (amount: number) => EntityParams;
};
```

### Step 3: Model Factory

```typescript
// models/{entity}/model.ts
import dayjs from 'dayjs';

import { createModelFactory } from '@/utils/model/createModel';

import { entitySchema } from './scheme';
import type { Entity, EntityParams, EntityStatus } from './types';

/**
 * Entity Model Factory
 * @description イミュータブルなEntityモデルを生成
 * @example
 * const entity = createEntity({
 *   id: '1',
 *   name: 'Sample',
 *   status: 'active',
 *   amount: 1000,
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z',
 * });
 * console.log(entity.amountLabel); // '1,000円'
 * console.log(entity.isActive); // true
 */
export const createEntity = createModelFactory<EntityParams, Entity>({
  schema: entitySchema,
  extension: (params) => {
    const createdAt = dayjs(params.createdAt);
    const updatedAt = dayjs(params.updatedAt);

    const statusLabels: Record<EntityStatus, string> = {
      active: '有効',
      inactive: '無効',
      pending: '保留中',
    };

    return {
      get amountLabel() {
        return `${params.amount.toLocaleString()}円`;
      },
      get createdAtLabel() {
        return createdAt.format('YYYY-MM-DD');
      },
      get isActive() {
        return params.status === 'active';
      },
      get isPending() {
        return params.status === 'pending';
      },
      get statusLabel() {
        return statusLabels[params.status];
      },
      get daysSinceCreation() {
        return dayjs().diff(createdAt, 'day');
      },
      get createdAtDayjs() {
        return createdAt;
      },
      get updatedAtDayjs() {
        return updatedAt;
      },
      withStatus: (status: EntityStatus): EntityParams => ({
        ...params,
        status,
        updatedAt: new Date().toISOString(),
      }),
      withAmount: (amount: number): EntityParams => ({
        ...params,
        amount,
        updatedAt: new Date().toISOString(),
      }),
    };
  },
});

/** @description 空判定（static method相当） */
export const isEntityEmpty = (params: Partial<EntityParams>): boolean => {
  return !params.id || !params.name;
};

/** @description デフォルト値でパラメータ生成 */
export const createEntityParams = (
  partial: Partial<EntityParams>,
): EntityParams => {
  const now = new Date().toISOString();
  return {
    id: partial.id ?? crypto.randomUUID(),
    name: partial.name ?? '',
    status: partial.status ?? 'pending',
    amount: partial.amount ?? 0,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
};

/** @description 配列をソート */
export const sortEntitiesByCreatedAt = (
  entities: Entity[],
  order: 'asc' | 'desc' = 'desc',
): Entity[] => {
  return [...entities].sort((a, b) => {
    const diff = a.createdAtDayjs.unix() - b.createdAtDayjs.unix();
    return order === 'asc' ? diff : -diff;
  });
};
```

### Step 4: Index Export

```typescript
// models/{entity}/index.ts
export { entitySchema } from './scheme';
export type { Entity, EntityParams, EntityStatus } from './types';
export {
  createEntity,
  isEntityEmpty,
  createEntityParams,
  sortEntitiesByCreatedAt,
} from './model';
```

## Validation Patterns (Zod Schema)

### Required Fields

```typescript
import { z } from 'zod';

const schema = z.object({
  id: z.string().min(1, 'id is required'),
  name: z.string().min(1, 'name is required'),
});
```

### Type Validation

```typescript
// Number validation
const schema = z.object({
  amount: z.number().min(0, 'amount must be non-negative'),
  price: z.number().positive('price must be positive'),
  quantity: z.number().int('quantity must be integer').min(1),
});

// String enum validation
const schema = z.object({
  status: z.enum(['active', 'inactive', 'pending']),
});

// Array validation
const schema = z.object({
  items: z.array(z.string()).min(1, 'items must not be empty'),
  tags: z.array(z.string()).max(10, 'too many tags'),
});
```

### Format Validation

```typescript
// Date validation (ISO 8601)
const schema = z.object({
  createdAt: z.string().datetime({ message: 'Invalid date format' }),
  // or with coercion
  birthDate: z.coerce.date(),
});

// Email validation
const schema = z.object({
  email: z.string().email('Invalid email format'),
});

// URL validation
const schema = z.object({
  url: z.string().url('Invalid URL format'),
});

// UUID validation
const schema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});
```

### Range Validation

```typescript
// Numeric range
const schema = z.object({
  amount: z
    .number()
    .min(0)
    .max(1000000, 'amount must be between 0 and 1,000,000'),
  percentage: z.number().min(0).max(100),
});

// String length
const schema = z.object({
  name: z.string().min(1).max(100, 'name must be 1-100 characters'),
  description: z.string().max(1000).optional(),
});
```

### Custom Validation

```typescript
// Custom refinement
const schema = z.object({
  password: z
    .string()
    .min(8)
    .refine((val) => /[A-Z]/.test(val), 'must contain uppercase')
    .refine((val) => /[0-9]/.test(val), 'must contain number'),
});

// Cross-field validation
const schema = z
  .object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });
```

## Computed Property Patterns (Extension)

### Formatting

```typescript
const createProduct = createModelFactory<ProductParams, Product>({
  schema: productSchema,
  extension: (params) => ({
    // 金額フォーマット
    get priceLabel() {
      return `${params.price.toLocaleString()}円`;
    },
    // 日付フォーマット
    get dateLabel() {
      return dayjs(params.date).format('YYYY/MM/DD');
    },
    // パーセンテージ
    get progressLabel() {
      return `${Math.round(params.progress * 100)}%`;
    },
  }),
});
```

### State Checks

```typescript
const createTask = createModelFactory<TaskParams, Task>({
  schema: taskSchema,
  extension: (params) => ({
    // ステータスチェック
    get isCompleted() {
      return params.status === 'completed';
    },
    // 期限チェック
    get isOverdue() {
      return (
        params.status !== 'completed' &&
        dayjs(params.dueDate).isBefore(dayjs(), 'day')
      );
    },
    // 条件組み合わせ
    get requiresAction() {
      return this.isOverdue || params.status === 'pending';
    },
  }),
});
```

### Calculations

```typescript
const createOrder = createModelFactory<OrderParams, Order>({
  schema: orderSchema,
  extension: (params) => {
    const createdAt = dayjs(params.createdAt);

    return {
      // 経過時間
      get elapsedDays() {
        return dayjs().diff(createdAt, 'day');
      },
      // 合計計算
      get totalAmount() {
        return params.items.reduce((sum, item) => sum + item.amount, 0);
      },
      // 派生値
      get discountedPrice() {
        return params.price * (1 - params.discountRate);
      },
      // dayjs インスタンス
      get createdAtDayjs() {
        return createdAt;
      },
    };
  },
});
```

### Update Methods (Immutable)

```typescript
const createUser = createModelFactory<UserParams, User>({
  schema: userSchema,
  extension: (params) => ({
    // ステータス更新 → 新しいParamsを返す
    withStatus: (status: UserStatus): UserParams => ({
      ...params,
      status,
      updatedAt: new Date().toISOString(),
    }),
    // 部分更新
    withUpdates: (
      updates: Partial<Omit<UserParams, 'id' | 'createdAt'>>,
    ): UserParams => ({
      ...params,
      ...updates,
      updatedAt: new Date().toISOString(),
    }),
  }),
});

// Usage
const user = createUser(params);
const updatedParams = user.withStatus('active');
const updatedUser = createUser(updatedParams); // 新しいモデルを生成
```

## Testing Domain Models

```typescript
// models/Entity.test.ts
import { describe, it, expect } from 'vitest';

import {
  createEntity,
  isEntityEmpty,
  createEntityParams,
  sortEntitiesByCreatedAt,
  type EntityParams,
} from './Entity';

describe('Entity Model', () => {
  // Valid test data
  const validParams: EntityParams = {
    id: '1',
    name: 'Test Entity',
    status: 'active',
    amount: 1000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  };

  describe('createEntity', () => {
    it('should create valid model', () => {
      const entity = createEntity(validParams);
      expect(entity.id).toBe('1');
      expect(entity.name).toBe('Test Entity');
      expect(entity.status).toBe('active');
    });

    it('should throw ZodError for missing id', () => {
      expect(() => createEntity({ ...validParams, id: '' })).toThrow();
    });

    it('should throw ZodError for invalid status', () => {
      expect(() =>
        createEntity({ ...validParams, status: 'invalid' as any }),
      ).toThrow();
    });

    it('should throw ZodError for invalid date', () => {
      expect(() =>
        createEntity({ ...validParams, createdAt: 'not-a-date' }),
      ).toThrow();
    });

    it('should be immutable', () => {
      const entity = createEntity(validParams);
      expect(() => {
        (entity as any).name = 'Changed';
      }).toThrow();
    });
  });

  describe('getters', () => {
    it('amountLabel should format with comma and yen', () => {
      const entity = createEntity({ ...validParams, amount: 10000 });
      expect(entity.amountLabel).toBe('10,000円');
    });

    it('isActive should return true for active status', () => {
      const entity = createEntity({ ...validParams, status: 'active' });
      expect(entity.isActive).toBe(true);
    });

    it('isActive should return false for inactive status', () => {
      const entity = createEntity({ ...validParams, status: 'inactive' });
      expect(entity.isActive).toBe(false);
    });

    it('statusLabel should return Japanese label', () => {
      const entity = createEntity({ ...validParams, status: 'pending' });
      expect(entity.statusLabel).toBe('保留中');
    });
  });

  describe('methods', () => {
    it('withStatus should return new params with updated status', () => {
      const entity = createEntity(validParams);
      const updated = entity.withStatus('inactive');
      expect(updated.status).toBe('inactive');
      expect(updated.id).toBe(validParams.id);
      // Original unchanged (immutability)
      expect(entity.status).toBe('active');
    });

    it('withAmount should return new params with updated amount', () => {
      const entity = createEntity(validParams);
      const updated = entity.withAmount(2000);
      expect(updated.amount).toBe(2000);
    });
  });

  describe('helper functions', () => {
    it('isEntityEmpty should return true for empty id', () => {
      expect(isEntityEmpty({ id: '' })).toBe(true);
    });

    it('isEntityEmpty should return true for empty name', () => {
      expect(isEntityEmpty({ id: '1', name: '' })).toBe(true);
    });

    it('isEntityEmpty should return false for valid params', () => {
      expect(isEntityEmpty(validParams)).toBe(false);
    });

    it('createEntityParams should generate id if not provided', () => {
      const params = createEntityParams({ name: 'Test' });
      expect(params.id).toBeDefined();
      expect(params.id.length).toBeGreaterThan(0);
    });

    it('sortEntitiesByCreatedAt should sort by createdAt desc', () => {
      const entities = [
        createEntity({
          ...validParams,
          id: '1',
          createdAt: '2024-01-01T00:00:00Z',
        }),
        createEntity({
          ...validParams,
          id: '2',
          createdAt: '2024-03-01T00:00:00Z',
        }),
        createEntity({
          ...validParams,
          id: '3',
          createdAt: '2024-02-01T00:00:00Z',
        }),
      ];
      const sorted = sortEntitiesByCreatedAt(entities, 'desc');
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('1');
    });
  });
});
```

## Anti-Patterns

### DON'T

```typescript
// ❌ Using class instead of createModelFactory
class BadEntity {
  readonly id: string;
  constructor(props: EntityProps) {
    this.id = props.id;
  }
}

// ❌ Mutable object (not using Object.freeze)
const createBadEntity = (params: EntityParams) => ({
  ...params,
  // これはミュータブル！
});

// ❌ External dependencies in model
const createBadEntity = createModelFactory({
  schema: entitySchema,
  extension: (params) => ({
    async save() { await api.post(...); },  // ❌ Don't call API
    updateStore() { store.dispatch(...); }, // ❌ Don't access store
  }),
});

// ❌ Missing schema validation
const createBadEntity = (params: EntityParams) => {
  // Zodスキーマなしで直接生成
  return Object.freeze({ ...params });
};

// ❌ Vague error messages in custom validation
const schema = z.object({
  id: z.string().min(1, 'Error'),  // 何のエラーかわからない
});

// ❌ Mutating params in extension
const createBadEntity = createModelFactory({
  schema: entitySchema,
  extension: (params) => ({
    badMethod() {
      params.name = 'changed';  // ❌ paramsを変更してはいけない
    },
  }),
});

// ❌ Returning Model from with* methods (should return Params)
const createBadEntity = createModelFactory({
  schema: entitySchema,
  extension: (params) => ({
    withStatus: (status: Status): Entity => {  // ❌ Entityを返している
      return createEntity({ ...params, status });
    },
  }),
});
```

### DO

```typescript
// ✅ Use createModelFactory with Zod schema
const createEntity = createModelFactory<EntityParams, Entity>({
  schema: entitySchema,
  extension: (params) => ({ ... }),
});

// ✅ Pure domain logic in extension getters
const createEntity = createModelFactory({
  schema: entitySchema,
  extension: (params) => ({
    get isValid() {
      return params.amount > 0 && params.status !== 'cancelled';
    },
    get displayName() {
      return `${params.name} (${params.id})`;
    },
  }),
});

// ✅ Clear, specific validation messages
const schema = z.object({
  id: z.string().min(1, 'id is required'),
  email: z.string().email('Invalid email format: must be valid email address'),
  amount: z.number().min(0, 'amount must be non-negative'),
});

// ✅ Immutable updates returning Params (not Model)
const createEntity = createModelFactory({
  schema: entitySchema,
  extension: (params) => ({
    withStatus: (status: EntityStatus): EntityParams => ({
      ...params,
      status,
      updatedAt: new Date().toISOString(),
    }),
  }),
});

// ✅ Static helpers as separate functions
export const isEntityEmpty = (params: Partial<EntityParams>): boolean => {
  return !params.id || !params.name;
};

export const createEntityParams = (partial: Partial<EntityParams>): EntityParams => {
  return { ...defaultParams, ...partial };
};
```

## Integration with Store

StoreはCQRSパターンに従い、複数ファイルに分割して管理する。

### Directory Structure

```
stores/
└── entity/
    ├── index.ts      # re-export
    ├── type.ts       # State type definition
    ├── state.ts      # Initial state
    ├── queries.ts    # Query definitions (Read)
    └── actions.ts    # Action definitions (Command)
```

### Step 1: State Type Definition

```typescript
// stores/entity/type.ts
import type { EntityParams } from '../../models/entity';

/** @description Entity store state */
export type EntityState = {
  items: EntityParams[]; // StoreはParams（raw data）を保持
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
};
```

### Step 2: Initial State

```typescript
// stores/entity/state.ts
import type { EntityState } from './type';

/** @description Initial state */
export const initialState: EntityState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};
```

### Step 3: Queries (Read)

```typescript
// stores/entity/queries.ts
import type { QueriesProps } from '@/utils/i-state';

import { createEntity, isEntityEmpty, type Entity } from '../../models/entity';
import type { EntityState } from './type';

/** @description Query definitions */
export const queries = {
  /** @description ParamsをModelに変換したリスト */
  itemList: (state): Entity[] =>
    state.items
      .filter((item) => !isEntityEmpty(item))
      .map((item) => createEntity(item)),

  /** @description 選択中のアイテム（Model） */
  selectedItem: (state): Entity | null => {
    if (!state.selectedId) return null;
    const found = state.items.find((item) => item.id === state.selectedId);
    return found ? createEntity(found) : null;
  },

  isLoading: (state): boolean => state.isLoading,
  error: (state): string | null => state.error,
} satisfies QueriesProps<EntityState>;
```

### Step 4: Actions (Command)

```typescript
// stores/entity/actions.ts
import type { ActionsProps } from '@/utils/i-state';

import {
  createEntity,
  type EntityParams,
  type EntityStatus,
} from '../../models/entity';
import type { EntityState } from './type';
import type { queries } from './queries';

/** @description Action definitions (Command役割) */
export const actions = {
  /** @description アイテム追加 */
  add({ state, dispatch }, params: EntityParams) {
    dispatch('items', [...state.items, params]);
  },

  /** @description Model経由でステータス更新 */
  updateStatus({ state, dispatch }, id: string, status: EntityStatus) {
    const updated = state.items.map((item) => {
      if (item.id !== id) return item;
      const entity = createEntity(item);
      return entity.withStatus(status);
    });
    dispatch('items', updated);
  },

  /** @description アイテム削除 */
  remove({ state, dispatch }, id: string) {
    dispatch(
      'items',
      state.items.filter((item) => item.id !== id),
    );
  },

  /** @description アイテム選択 */
  select({ dispatch }, id: string | null) {
    dispatch('selectedId', id);
  },

  /** @description 一括設定 */
  setItems({ dispatch }, items: EntityParams[]) {
    dispatch('items', items);
  },

  /** @description ローディング状態設定 */
  setLoading({ dispatch }, isLoading: boolean) {
    dispatch('isLoading', isLoading);
  },

  /** @description エラー設定 */
  setError({ dispatch }, error: string | null) {
    dispatch('error', error);
  },
} satisfies ActionsProps<EntityState, typeof queries>;
```

### Step 5: Store Definition & Export

```typescript
// stores/entity/index.ts
import { defineStore } from '@/utils/i-state';

import { initialState } from './state';
import { queries } from './queries';
import { actions } from './actions';

export const EntityStore = defineStore({
  state: initialState,
  queries,
  actions,
});

export type { EntityState } from './type';
```

### Service層との連携

ServiceはAPIとStore actionsを受け取り、複数のstore actionを呼び出すオーケストレーション層として機能する。

**重要**: `getStore`は存在しない。`useStore`はReact hookなのでService内では使えない。
actionsはHook層で取得し、ServiceにDIする。

```typescript
// services/types.ts
import type { EntityParams } from '../models/entity';
import type { EntityStore } from '../stores/entity';

/** @description API interface for DI */
export type EntityApi = {
  fetchAll(): Promise<EntityParams[]>;
  create(
    params: Omit<EntityParams, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<EntityParams>;
  update(id: string, params: Partial<EntityParams>): Promise<EntityParams>;
  delete(id: string): Promise<void>;
};

/** @description Actions type extracted from Store */
export type EntityActions = ReturnType<typeof EntityStore.useStore>['actions'];
```

```typescript
// services/entityService.ts
import { createEntityParams, type EntityParams } from '../models/entity';
import type { EntityApi, EntityActions } from './types';

type EntityServiceDeps = {
  api: EntityApi;
  actions: EntityActions; // actionsはHookから注入
};

/**
 * Entity Service Factory
 * @description APIとactionsを注入してサービスを生成
 */
export const createEntityService = ({ api, actions }: EntityServiceDeps) => ({
  /**
   * 全件取得してStoreに設定
   */
  async fetchAll() {
    actions.setLoading(true);
    actions.setError(null);
    try {
      const items = await api.fetchAll();
      actions.setItems(items);
    } catch (e) {
      actions.setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      actions.setLoading(false);
    }
  },

  /**
   * 新規作成
   */
  async create(partial: Partial<EntityParams>) {
    const params = createEntityParams(partial);
    try {
      const created = await api.create(params);
      actions.add(created);
      return created;
    } catch (e) {
      actions.setError(e instanceof Error ? e.message : 'Failed to create');
      throw e;
    }
  },
});
```

```typescript
// hooks/useEntity.ts
import { useMemo } from 'react';

import { EntityStore } from '../stores/entity';
import { createEntityService } from '../services/entityService';
import { entityApi } from '../api/entityApi';

/**
 * Entity Hook
 * @description Service生成時にuseStoreから取得したactionsを注入
 */
export const useEntity = () => {
  const { queries, actions } = EntityStore.useStore();

  // Service生成時にactionsをDI
  const service = useMemo(
    () => createEntityService({ api: entityApi, actions }),
    [actions],
  );

  return {
    // Queries
    items: queries.itemList,
    selectedItem: queries.selectedItem,
    isLoading: queries.isLoading,
    error: queries.error,
    // Service methods
    fetchAll: service.fetchAll,
    create: service.create,
  };
};
```

## Related Skills

- **cqrs-feature**: CQRS全体のアーキテクチャガイド
- **tdd-guide**: テスト駆動開発でDomain Modelを実装
- **feature-scaffold**: ボイラープレート生成
