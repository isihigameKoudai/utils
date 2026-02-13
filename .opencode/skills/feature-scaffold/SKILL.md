---
name: feature-scaffold
description: Generate CQRS feature directory structure and boilerplate files using createModelFactory with Zod validation. Creates models, stores (actions as commands), services for DI, and components following repository conventions.
---

# Feature Scaffold Generator

新規Feature開発のためのディレクトリ構造とボイラープレートファイルを自動生成するスキル。CQRSパターン（Store actionsをCommand役割として使用）に準拠したファイル構造を提供する。

## Usage

```
@feature-scaffold

Feature名: TaskManager
主要エンティティ: Task
機能説明: タスク管理機能（作成、更新、削除、フィルタリング）
```

## Generated Structure

> ディレクトリ構造の詳細は [cqrs-feature](../cqrs-feature/SKILL.md#directory-structure) を参照。
> このスキルは以下の全ディレクトリ（models, stores, services, api, components, pages, hooks, constants, types）のボイラープレートを生成する。

## Template Files

### Schema Template

```typescript
// models/{entity}/scheme.ts
import { z } from 'zod';

/**
 * {Entity} validation schema
 * @description {Entity}のバリデーションスキーマ
 */
export const {entity}Schema = z.object({
  id: z.string().min(1, 'id is required'),
  // TODO: Add entity properties
  createdAt: z.string().datetime({ message: 'Invalid date format' }),
  updatedAt: z.string().datetime({ message: 'Invalid date format' }),
});
```

### Types Template

```typescript
// models/{entity}/types.ts
import type { z } from 'zod';
import type dayjs from 'dayjs';

import type { {entity}Schema } from './scheme';

/**
 * Raw params type (Store/API用)
 * @description StoreやAPIで使用する生データ型
 */
export type {Entity}Params = z.infer<typeof {entity}Schema>;

/**
 * {Entity} Model type
 * @description {Entity}Params + computed properties + methods
 */
export type {Entity} = {Entity}Params & {
  /** @description 表示用日付 */
  readonly createdAtLabel: string;
  /** @description dayjs形式のcreatedAt */
  readonly createdAtDayjs: dayjs.Dayjs;
  /** @description dayjs形式のupdatedAt */
  readonly updatedAtDayjs: dayjs.Dayjs;
  // TODO: Add computed properties and methods
};
```

### Model Template

```typescript
// models/{entity}/model.ts
import dayjs from 'dayjs';

import { createModelFactory } from '@/utils/model/createModel';

import { {entity}Schema } from './scheme';
import type { {Entity}, {Entity}Params } from './types';

/**
 * {Entity} Model Factory
 * @description イミュータブルな{Entity}モデルを生成
 * @example
 * const {entity} = create{Entity}({
 *   id: '1',
 *   createdAt: '2024-01-01T00:00:00Z',
 *   updatedAt: '2024-01-01T00:00:00Z',
 * });
 */
export const create{Entity} = createModelFactory<{Entity}Params, {Entity}>({
  schema: {entity}Schema,
  extension: (params) => {
    const createdAt = dayjs(params.createdAt);
    const updatedAt = dayjs(params.updatedAt);

    return {
      get createdAtLabel() {
        return createdAt.format('YYYY-MM-DD');
      },
      get createdAtDayjs() {
        return createdAt;
      },
      get updatedAtDayjs() {
        return updatedAt;
      },
      // TODO: Add computed properties and methods
    };
  },
});

/**
 * Empty check (static method equivalent)
 * @description 空判定
 */
export const is{Entity}Empty = (params: Partial<{Entity}Params>): boolean => {
  return !params.id;
};

/**
 * Create params with defaults
 * @description デフォルト値でパラメータ生成
 */
export const create{Entity}Params = (
  partial: Partial<{Entity}Params>,
): {Entity}Params => {
  const now = new Date().toISOString();
  return {
    id: partial.id ?? crypto.randomUUID(),
    // TODO: Add default values
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
};
```

### Model Index Template

```typescript
// models/{entity}/index.ts
export { {entity}Schema } from './scheme';
export type { {Entity}, {Entity}Params } from './types';
export {
  create{Entity},
  is{Entity}Empty,
  create{Entity}Params,
} from './model';
```

### Model Test Template

```typescript
// models/{entity}/model.test.ts
import { describe, it, expect } from 'vitest';

import {
  create{Entity},
  is{Entity}Empty,
  create{Entity}Params,
} from './model';
import type { {Entity}Params } from './types';

describe('{Entity} Model', () => {
  const validParams: {Entity}Params = {
    id: '1',
    // TODO: Add test data
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  };

  describe('create{Entity}', () => {
    it('should create valid model', () => {
      const {entity} = create{Entity}(validParams);
      expect({entity}.id).toBe('1');
    });

    it('should throw ZodError for missing id', () => {
      expect(() => create{Entity}({ ...validParams, id: '' })).toThrow();
    });

    it('should be immutable', () => {
      const {entity} = create{Entity}(validParams);
      expect(() => {
        ({entity} as any).id = 'changed';
      }).toThrow();
    });
  });

  describe('getters', () => {
    it('createdAtLabel should format date', () => {
      const {entity} = create{Entity}(validParams);
      expect({entity}.createdAtLabel).toBe('2024-01-01');
    });
  });

  describe('helper functions', () => {
    it('is{Entity}Empty should return true for empty id', () => {
      expect(is{Entity}Empty({ id: '' })).toBe(true);
    });

    it('is{Entity}Empty should return false for valid params', () => {
      expect(is{Entity}Empty(validParams)).toBe(false);
    });

    it('create{Entity}Params should generate id if not provided', () => {
      const params = create{Entity}Params({});
      expect(params.id).toBeDefined();
      expect(params.id.length).toBeGreaterThan(0);
    });
  });
});
```

### Store Type Template

```typescript
// stores/{entity}/type.ts
import type { {Entity}Params } from '../../models/{entity}';

/** @description {Entity} store state */
export type {Entity}State = {
  items: {Entity}Params[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
};
```

### Store State Template

```typescript
// stores/{entity}/state.ts
import type { {Entity}State } from './type';

/** @description Initial state */
export const initialState: {Entity}State = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
};
```

### Store Queries Template

```typescript
// stores/{entity}/queries.ts
import type { QueriesProps } from '@/utils/i-state';

import {
  create{Entity},
  is{Entity}Empty,
  type {Entity},
} from '../../models/{entity}';
import type { {Entity}State } from './type';

/** @description Query definitions */
export const queries = {
  /** @description ParamsをModelに変換したリスト */
  itemList: (state): {Entity}[] =>
    state.items
      .filter((item) => !is{Entity}Empty(item))
      .map((item) => create{Entity}(item)),

  /** @description 選択中のアイテム（Model） */
  selectedItem: (state): {Entity} | null => {
    if (!state.selectedId) return null;
    const found = state.items.find((item) => item.id === state.selectedId);
    return found ? create{Entity}(found) : null;
  },

  isLoading: (state): boolean => state.isLoading,
  error: (state): string | null => state.error,
} satisfies QueriesProps<{Entity}State>;
```

### Store Actions Template

```typescript
// stores/{entity}/actions.ts
import type { ActionsProps } from '@/utils/i-state';

import type { {Entity}Params } from '../../models/{entity}';
import type { {Entity}State } from './type';
import type { queries } from './queries';

/** @description Action definitions (Command役割) */
export const actions = {
  /** @description アイテム追加 */
  add({ state, dispatch }, params: {Entity}Params) {
    dispatch('items', [...state.items, params]);
  },

  /** @description アイテム更新 */
  update({ state, dispatch }, id: string, updates: Partial<{Entity}Params>) {
    const updated = state.items.map((item) =>
      item.id === id
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item,
    );
    dispatch('items', updated);
  },

  /** @description アイテム削除 */
  remove({ state, dispatch }, id: string) {
    dispatch('items', state.items.filter((item) => item.id !== id));
  },

  /** @description アイテム選択 */
  select({ dispatch }, id: string | null) {
    dispatch('selectedId', id);
  },

  /** @description 一括設定 */
  setItems({ dispatch }, items: {Entity}Params[]) {
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
} satisfies ActionsProps<{Entity}State, typeof queries>;
```

### Store Index Template

```typescript
// stores/{entity}/index.ts
import { defineStore } from '@/utils/i-state';

import { initialState } from './state';
import { queries } from './queries';
import { actions } from './actions';

export const {Entity}Store = defineStore({
  state: initialState,
  queries,
  actions,
});

export type { {Entity}State } from './type';
```

### Service Types Template

```typescript
// services/types.ts
import type { {Entity}Params } from '../models/{entity}';
import type { {Entity}Store } from '../stores/{entity}';

/**
 * {Entity} API Interface
 * @description DIのためのAPIインターフェース
 */
export type {Entity}Api = {
  fetchAll(): Promise<{Entity}Params[]>;
  create(params: Omit<{Entity}Params, 'id' | 'createdAt' | 'updatedAt'>): Promise<{Entity}Params>;
  update(id: string, params: Partial<{Entity}Params>): Promise<{Entity}Params>;
  delete(id: string): Promise<void>;
};

/**
 * {Entity} Actions type
 * @description StoreのuseStoreから取得したactionsの型
 */
export type {Entity}Actions = ReturnType<typeof {Entity}Store.useStore>['actions'];
```

### Service Template

```typescript
// services/{entity}Service.ts
import { create{Entity}Params, type {Entity}Params } from '../models/{entity}';
import type { {Entity}Api, {Entity}Actions } from './types';

type {Entity}ServiceDeps = {
  api: {Entity}Api;
  actions: {Entity}Actions; // actionsはHookから注入
};

/**
 * {Entity} Service Factory
 * @description APIとactionsを注入してサービスを生成
 * @example
 * const { actions } = {Entity}Store.useStore();
 * const service = create{Entity}Service({ api: {entity}Api, actions });
 * await service.fetchAll();
 */
export const create{Entity}Service = ({ api, actions }: {Entity}ServiceDeps) => ({
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
      const message = e instanceof Error ? e.message : 'Failed to fetch';
      actions.setError(message);
      throw e;
    } finally {
      actions.setLoading(false);
    }
  },

  /**
   * 新規作成
   */
  async create(partial: Partial<{Entity}Params>) {
    const params = create{Entity}Params(partial);
    try {
      const created = await api.create(params);
      actions.add(created);
      return created;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to create';
      actions.setError(message);
      throw e;
    }
  },

  /**
   * 更新
   */
  async update(id: string, updates: Partial<{Entity}Params>) {
    try {
      const updated = await api.update(id, updates);
      actions.update(id, updated);
      return updated;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update';
      actions.setError(message);
      throw e;
    }
  },

  /**
   * 削除
   */
  async remove(id: string) {
    try {
      await api.delete(id);
      actions.remove(id);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to delete';
      actions.setError(message);
      throw e;
    }
  },

  /**
   * 選択
   */
  select(id: string | null) {
    actions.select(id);
  },
});
```

### Hook Template

**IMPORTANT: Custom hooksにはuseEffectなどの副作用を含めない。値とコールバックの宣言のみ。**
**副作用（useEffect等）は必ずコンポーネント側（page.tsx）で扱うこと。**

```typescript
// hooks/use{FeatureName}.ts
import { useCallback, useMemo } from 'react';

import { {Entity}Store } from '../stores/{entity}';
import { create{Entity}Service } from '../services/{entity}Service';
import { {entity}Api } from '../api/{entity}Api';
import type { {Entity}Params } from '../models/{entity}';

/**
 * {FeatureName} Hook
 * @description {FeatureName}機能のカスタムフック（値・コールバックのみ、副作用なし）
 */
export const use{FeatureName} = () => {
  const { queries, actions } = {Entity}Store.useStore();

  // Service生成時にactionsをDI
  const service = useMemo(
    () => create{Entity}Service({ api: {entity}Api, actions }),
    [actions],
  );

  // Queries (from store)
  const items = queries.itemList;
  const selectedItem = queries.selectedItem;
  const isLoading = queries.isLoading;
  const error = queries.error;

  // Commands (via service)
  const fetchAll = useCallback(() => service.fetchAll(), [service]);

  const create = useCallback(
    (partial: Partial<{Entity}Params>) => service.create(partial),
    [service],
  );

  const update = useCallback(
    (id: string, updates: Partial<{Entity}Params>) => service.update(id, updates),
    [service],
  );

  const remove = useCallback((id: string) => service.remove(id), [service]);

  const select = useCallback(
    (id: string | null) => service.select(id),
    [service],
  );

  return {
    // Queries
    items,
    selectedItem,
    isLoading,
    error,
    // Commands
    fetchAll,
    create,
    update,
    remove,
    select,
  };
};
```

### Page Style Template

```typescript
// pages/{PageName}/style.ts
import { styled } from '@/utils/ui/styled';

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const Title = styled('h1')({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1a1a1a',
  margin: 0,
});

export const ErrorMessage = styled('div')({
  color: '#dc2626',
  padding: '1rem',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
});

export const LoadingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem',
  color: '#6b7280',
});

export const ItemCount = styled('p')({
  color: '#6b7280',
  margin: 0,
});
```

### Page Template

**pages/{PageName}/ ディレクトリ構造:**

- `index.ts` — re-export（page.tsxからのnamed export）
- `page.tsx` — ページ本体（useEffectなどの副作用はここで扱う）
- `style.ts` — スタイル定義（任意。ただしstyle.tsが存在する場合はpage.tsxも必須）

#### pages/{PageName}/page.tsx

```typescript
// pages/{PageName}/page.tsx
import { useEffect } from 'react';

import { use{FeatureName} } from '../../hooks/use{FeatureName}';

import {
  Container,
  Title,
  ErrorMessage,
  LoadingContainer,
  ItemCount,
} from './style';

/**
 * {FeatureName} Page
 * @description {FeatureName}のメインページ
 */
export const {FeatureName}Page = () => {
  const { items, isLoading, error, fetchAll } = use{FeatureName}();

  // 副作用はコンポーネント側で扱う
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>Loading...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{FeatureName}</Title>
      <ItemCount>Total items: {items.length}</ItemCount>
      {/* TODO: Implement feature UI */}
    </Container>
  );
};
```

#### pages/{PageName}/index.ts

```typescript
// pages/{PageName}/index.ts
export { {FeatureName}Page } from './page';
```

### API Template

```typescript
// api/{entity}Api.ts
import type { {Entity}Params } from '../models/{entity}';
import type { {Entity}Api } from '../services/types';

const API_BASE = '/api/{entities}';

/**
 * {Entity} API Implementation
 * @description {Entity}Apiの実装
 */
export const {entity}Api: {Entity}Api = {
  async fetchAll(): Promise<{Entity}Params[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  },

  async create(
    payload: Omit<{Entity}Params, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<{Entity}Params> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to create: ${response.statusText}`);
    }
    return response.json();
  },

  async update(id: string, payload: Partial<{Entity}Params>): Promise<{Entity}Params> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to update: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }
  },
};
```

### Index Files

```typescript
// models/{entity}/index.ts
export { {entity}Schema } from './scheme';
export type { {Entity}, {Entity}Params } from './types';
export {
  create{Entity},
  is{Entity}Empty,
  create{Entity}Params,
} from './model';

// stores/{entity}/index.ts
import { defineStore } from '@/utils/i-state';

import { initialState } from './state';
import { queries } from './queries';
import { actions } from './actions';

export const {Entity}Store = defineStore({
  state: initialState,
  queries,
  actions,
});

export type { {Entity}State } from './type';

// services/index.ts
export { create{Entity}Service } from './{entity}Service';
export type * from './types';

// hooks/index.ts
export { use{FeatureName} } from './use{FeatureName}';

// api/index.ts
export { {entity}Api } from './{entity}Api';

// components/index.ts
// Export components as they are created

// pages/{PageName}/index.ts
export { {FeatureName}Page } from './page';

// constants/index.ts
// Export constants as they are defined

// types/index.ts
// Export shared types as they are defined
```

## Naming Conventions

> 命名規約の詳細は [cqrs-feature](../cqrs-feature/SKILL.md#naming-conventions) を参照。

feature-scaffold固有の追加パターン：

| Type           | Pattern                | Example              |
| -------------- | ---------------------- | -------------------- |
| Params Creator | `create{Entity}Params` | `createTaskParams`   |
| Page Dir       | `pages/{PageName}/`    | `pages/TaskManager/` |
| Style File     | `style.ts`             | `style.ts`           |

## Checklist

生成後の確認事項：

- [ ] Schema: プロパティを追加（`models/schemas/{entity}.ts`）
- [ ] Model: computed propertiesとメソッドを追加
- [ ] Model Test: テストケースを追加
- [ ] Store: 必要なactionsを追加
- [ ] Service: ビジネスロジックを追加
- [ ] API: エンドポイントを正しく設定
- [ ] Hook: 必要なコマンドを追加
- [ ] UI: コンポーネントを実装
- [ ] Route: ルーティングを設定

## Best Practices

1. **まずSchemaから始める**: Zodスキーマでデータ構造を定義
2. **次にModel**: computed properties, validation, メソッドを実装
3. **TDDでModel実装**: テストを書きながらModelを実装
4. **Store は最小限**: 必要なstateとactionsのみ
5. **ServiceでDI**: APIなど外部依存はServiceに注入
6. **UIは最後**: ロジックが固まってからUI実装
7. **Hookに副作用を含めない**: useEffectなどの副作用はpage.tsxで扱う。Hookは値とコールバックのみ
8. **Pages構造を守る**: `pages/{PageName}/index.ts` + `page.tsx` + `style.ts（任意）`

## Related Skills

- **cqrs-feature**: CQRS全体のアーキテクチャガイド
- **domain-model**: createModelFactoryの詳細な使い方
- **tdd-guide**: テスト駆動開発でModelを実装
