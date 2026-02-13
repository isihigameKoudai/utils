---
name: cqrs-feature
description: CQRS (Command Query Responsibility Segregation) architecture guide for building features in React 19 + TypeScript + Zustand. Uses createModelFactory for immutable domain models, i-state for state management, and services for orchestration.
---

# CQRS Feature Development Guide

React 19 + TypeScript + Zustandを使用したCQRSパターンに基づくFeature開発のための包括的ガイド。このリポジトリの既存パターンとコーディング規約に完全準拠した設計を提供する。

## Overview

CQRSは「Command Query Responsibility Segregation」の略で、データの読み取り（Query）と書き込み（Command）の責務を分離するアーキテクチャパターン。このリポジトリでは、既存の`i-state`（Zustandベース）を活用し、フロントエンドに最適化されたCQRS実装を行う。

### Core Principles

1. **Command**: Store actionsが担当（状態を変更する操作）
2. **Query**: Store queriesが担当（状態を読み取る操作、純粋関数）
3. **Domain Model**: `createModelFactory`で作成するイミュータブルなモデル
4. **Store**: Zustandベースの`i-state`パターン（actionsがCommandの役割）
5. **Service**: 複数のstore actionsのオーケストレーション、DI

### Key Design Decisions

- **classを使わない**: `createModelFactory`でイミュータブルなモデルを生成
- **commandsディレクトリなし**: Store actionsがCommand層の役割を担う
- **servicesディレクトリ**: 複数store操作のオーケストレーション、外部API統合、DI

## Directory Structure

```
src/features/<FeatureName>/
├── models/                      # Domain models (createModelFactory)
│   ├── index.ts                 # Models re-export
│   └── <entity>/                # Entity別ディレクトリ
│       ├── index.ts             # Entity re-export
│       ├── scheme.ts            # Zod schema definition
│       ├── types.ts             # Params & Model type definitions
│       └── model.ts             # createModelFactory implementation
├── stores/                      # Zustand stores (i-state pattern)
│   ├── index.ts                 # Store re-export
│   └── <entity>/                # Entity別ディレクトリ（大きい場合）
│       ├── index.ts             # Store export
│       ├── type.ts              # State types
│       ├── state.ts             # Initial state
│       ├── queries.ts           # Query definitions
│       └── actions.ts           # Action definitions (Commands)
├── services/                    # Orchestration & DI
│   ├── index.ts                 # Service re-export
│   ├── types.ts                 # API interface types (for DI)
│   └── <entity>Service.ts       # Service implementation
├── api/                         # External API integration
│   ├── index.ts
│   ├── types.ts
│   └── <entity>Api.ts
├── components/                  # Feature-specific components
│   ├── <ComponentName>/
│   │   ├── index.tsx
│   │   ├── style.ts             # styled components
│   │   └── types.ts
│   └── index.ts
├── pages/                       # Page components
│   └── <PageName>/              # Page別ディレクトリ
│       ├── index.ts             # re-export
│       ├── page.tsx             # Page component本体（JSX + useEffect等の副作用）
│       └── style.ts             # Page styles
├── hooks/                       # Feature-specific hooks
│   ├── index.ts
│   └── use<Feature>.ts
├── constants/                   # Feature constants
│   └── index.ts
└── types/                       # Shared feature types
    └── index.ts
```

## Implementation Patterns

### 1. Domain Model Pattern (createModelFactory)

`@utils/model/createModel.ts`の`createModelFactory`を使用してイミュータブルなドメインモデルを作成する。

#### File Structure

```
models/
└── todo/
    ├── index.ts      # re-export
    ├── scheme.ts     # Zod schema definition
    ├── types.ts      # Params & Model type definitions
    └── model.ts      # createModelFactory implementation
```

#### Step 1: Zod Schema Definition

```typescript
// models/todo/scheme.ts
import { z } from 'zod';

/** @description Todo entity validation schema */
export const todoSchema = z.object({
  id: z.string().min(1, 'id is required'),
  title: z.string().min(1, 'title is required'),
  description: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  dueDate: z.string().datetime({ message: 'Invalid date format' }),
  createdAt: z.string().datetime({ message: 'Invalid date format' }),
});
```

#### Step 2: Types Definition

```typescript
// models/todo/types.ts
import type { z } from 'zod';
import type dayjs from 'dayjs';

import type { todoSchema } from './scheme';

/** @description Raw params type (store/API用) */
export type TodoParams = z.infer<typeof todoSchema>;

/** @description Status type */
export type TodoStatus = TodoParams['status'];

/**
 * Todo Model type
 * @description TodoParams + computed properties + methods
 */
export type Todo = TodoParams & {
  /** @description 表示用のdue date */
  readonly dueDateLabel: string;
  /** @description 期限切れかどうか */
  readonly isOverdue: boolean;
  /** @description 完了済みかどうか */
  readonly isCompleted: boolean;
  /** @description 状態のラベル */
  readonly statusLabel: string;
  /** @description dayjs形式のdueDate */
  readonly dueDateDayjs: dayjs.Dayjs;
  /** @description dayjs形式のcreatedAt */
  readonly createdAtDayjs: dayjs.Dayjs;
  /** @description ステータス更新後のパラメータを返す */
  withStatus: (status: TodoStatus) => TodoParams;
};
```

#### Step 3: Model Factory

```typescript
// models/todo/model.ts
import dayjs from 'dayjs';

import { createModelFactory } from '@/utils/model/createModel';

import { todoSchema } from './scheme';
import type { Todo, TodoParams, TodoStatus } from './types';

/**
 * Todo Model Factory
 * @description イミュータブルなTodoモデルを生成
 * @example
 * const todo = createTodo({
 *   id: '1',
 *   title: 'タスク名',
 *   description: '説明',
 *   status: 'pending',
 *   dueDate: '2024-12-31T00:00:00Z',
 *   createdAt: '2024-01-01T00:00:00Z',
 * });
 * console.log(todo.isOverdue); // boolean
 * console.log(todo.statusLabel); // '未着手'
 */
export const createTodo = createModelFactory<TodoParams, Todo>({
  schema: todoSchema,
  extension: (params) => {
    const dueDate = dayjs(params.dueDate);
    const createdAt = dayjs(params.createdAt);

    const statusLabels: Record<TodoStatus, string> = {
      pending: '未着手',
      in_progress: '進行中',
      completed: '完了',
    };

    return {
      get dueDateLabel() {
        return dueDate.format('YYYY-MM-DD');
      },
      get isOverdue() {
        return (
          params.status !== 'completed' && dueDate.isBefore(dayjs(), 'day')
        );
      },
      get isCompleted() {
        return params.status === 'completed';
      },
      get statusLabel() {
        return statusLabels[params.status];
      },
      get dueDateDayjs() {
        return dueDate;
      },
      get createdAtDayjs() {
        return createdAt;
      },
      withStatus: (status: TodoStatus): TodoParams => ({
        ...params,
        status,
      }),
    };
  },
});

/** @description 空判定（static method相当） */
export const isTodoEmpty = (params: Partial<TodoParams>): boolean => {
  return !params.id || !params.title;
};
```

#### Step 4: Index Export

```typescript
// models/todo/index.ts
export { todoSchema } from './scheme';
export type { Todo, TodoParams, TodoStatus } from './types';
export { createTodo, isTodoEmpty } from './model';
```

```typescript
// models/index.ts
export * from './todo';
```

````

### 2. Store Pattern (i-state) - Actions as Commands

Store actionsがCommand層の役割を担う。生データ（Params）をstateに保存し、QueriesでDomain Modelに変換して返す。

#### File Structure

```
stores/
└── todo/
    ├── index.ts      # Store export
    ├── type.ts       # State types
    ├── state.ts      # Initial state
    ├── queries.ts    # Query definitions
    └── actions.ts    # Action definitions (Commands)
```

#### Step 1: State Types

```typescript
// stores/todo/type.ts
import type { TodoParams } from '../../models/todo';

export type TodoState = {
  todos: TodoParams[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
};
```

#### Step 2: Initial State

```typescript
// stores/todo/state.ts
import type { TodoState } from './type';

export const initialState: TodoState = {
  todos: [],
  selectedId: null,
  isLoading: false,
  error: null,
};
```

#### Step 3: Queries (Read Operations)

```typescript
// stores/todo/queries.ts
import type { QueriesProps } from '@/utils/i-state';

import {
  createTodo,
  isTodoEmpty,
  type Todo,
  type TodoStatus,
} from '../../models/todo';

import type { TodoState } from './type';

export const queries = {
  /** @description 全Todoリスト（Domain Modelに変換） */
  todoList: (state): Todo[] =>
    state.todos.filter((t) => !isTodoEmpty(t)).map((t) => createTodo(t)),

  /** @description 選択中のTodo */
  selectedTodo: (state): Todo | null => {
    if (!state.selectedId) return null;
    const found = state.todos.find((t) => t.id === state.selectedId);
    return found ? createTodo(found) : null;
  },

  /** @description ステータスでフィルタ */
  todosByStatus:
    (state) =>
    (status: TodoStatus): Todo[] =>
      state.todos
        .filter((t) => t.status === status && !isTodoEmpty(t))
        .map((t) => createTodo(t)),

  /** @description 期限切れTodo */
  overdueTodos: (state): Todo[] =>
    state.todos
      .filter((t) => !isTodoEmpty(t))
      .map((t) => createTodo(t))
      .filter((t) => t.isOverdue),

  /** @description 完了率 */
  completionRate: (state): number => {
    const total = state.todos.length;
    if (total === 0) return 0;
    const completed = state.todos.filter((t) => t.status === 'completed').length;
    return Math.round((completed / total) * 100);
  },

  /** @description ローディング状態 */
  isLoading: (state): boolean => state.isLoading,

  /** @description エラー状態 */
  error: (state): string | null => state.error,
} satisfies QueriesProps<TodoState>;
```

#### Step 4: Actions (Commands)

```typescript
// stores/todo/actions.ts
import type { ActionsProps } from '@/utils/i-state';

import type { TodoParams } from '../../models/todo';

import type { TodoState } from './type';
import type { queries } from './queries';

export const actions = {
  // ----- Command: Create -----
  /**
   * @description Todoを作成する
   * @command CreateTodo
   */
  createTodo(
    { state, dispatch },
    payload: { title: string; description?: string; dueDate: string },
  ) {
    const newTodo: TodoParams = {
      id: crypto.randomUUID(),
      title: payload.title,
      description: payload.description ?? '',
      status: 'pending',
      dueDate: payload.dueDate,
      createdAt: new Date().toISOString(),
    };
    dispatch('todos', [...state.todos, newTodo]);
  },

  // ----- Command: Update -----
  /**
   * @description Todoを更新する
   * @command UpdateTodo
   */
  updateTodo(
    { state, dispatch },
    payload: { id: string } & Partial<Omit<TodoParams, 'id' | 'createdAt'>>,
  ) {
    const updated = state.todos.map((t) =>
      t.id === payload.id ? { ...t, ...payload } : t,
    );
    dispatch('todos', updated);
  },

  // ----- Command: Delete -----
  /**
   * @description Todoを削除する
   * @command DeleteTodo
   */
  deleteTodo({ state, dispatch }, id: string) {
    dispatch(
      'todos',
      state.todos.filter((t) => t.id !== id),
    );
  },

  // ----- Command: Select -----
  /**
   * @description Todoを選択する
   * @command SelectTodo
   */
  selectTodo({ dispatch }, id: string | null) {
    dispatch('selectedId', id);
  },

  // ----- Command: Set Todos (for API integration) -----
  /**
   * @description Todoリストを設定する（API取得後）
   * @command SetTodos
   */
  setTodos({ dispatch }, todos: TodoParams[]) {
    dispatch('todos', todos);
  },

  // ----- Command: Batch Complete -----
  /**
   * @description 複数Todoを一括完了する
   * @command CompleteTodos
   */
  completeTodos({ state, dispatch }, ids: string[]) {
    const updated = state.todos.map((t) =>
      ids.includes(t.id) ? { ...t, status: 'completed' as const } : t,
    );
    dispatch('todos', updated);
  },

  // ----- Loading/Error Management -----
  setLoading({ dispatch }, isLoading: boolean) {
    dispatch('isLoading', isLoading);
  },

  setError({ dispatch }, error: string | null) {
    dispatch('error', error);
  },

  clearError({ dispatch }) {
    dispatch('error', null);
  },
} satisfies ActionsProps<TodoState, typeof queries>;
```

#### Step 5: Store Export

```typescript
// stores/todo/index.ts
import { defineStore } from '@/utils/i-state';

import { initialState } from './state';
import { queries } from './queries';
import { actions } from './actions';

export const TodoStore = defineStore({
  state: initialState,
  queries,
  actions,
});

export type { TodoState } from './type';
```

```typescript
// stores/index.ts
export { TodoStore, type TodoState } from './todo';
```
````

### 3. Service Pattern (Orchestration & DI)

複数のstore actions呼び出し、API統合、依存性注入を担当するService層。

> **IMPORTANT**: `defineStore`は`useStore`（React hook）のみを提供し、`getStore`は存在しない。
> ServiceはReactコンポーネント/hook内から呼び出すか、actionsを依存として注入する。

#### Step 1: API Interface Types (for DI)

```typescript
// services/types.ts
import type { TodoParams } from '../models/todo';

/** @description API interface for dependency injection */
export type TodoApi = {
  fetchAll(): Promise<TodoParams[]>;
  create(payload: Omit<TodoParams, 'id' | 'createdAt'>): Promise<TodoParams>;
  update(id: string, payload: Partial<TodoParams>): Promise<TodoParams>;
  delete(id: string): Promise<void>;
};

/** @description Store actions interface for DI */
export type TodoActions = {
  setTodos(todos: TodoParams[]): void;
  createTodo(payload: {
    title: string;
    description?: string;
    dueDate: string;
  }): void;
  updateTodo(
    payload: { id: string } & Partial<Omit<TodoParams, 'id' | 'createdAt'>>,
  ): void;
  deleteTodo(id: string): void;
  completeTodos(ids: string[]): void;
  setLoading(isLoading: boolean): void;
  setError(error: string | null): void;
};

/** @description Service dependencies */
export type TodoServiceDeps = {
  api: TodoApi;
  actions: TodoActions;
};
```

#### Step 2: Service Implementation

```typescript
// services/todoService.ts
import type { TodoServiceDeps } from './types';

/**
 * Todo Service Factory
 * @description Orchestration layer with DI
 * @example
 * // In a custom hook
 * const { actions } = TodoStore.useStore();
 * const service = useMemo(
 *   () => createTodoService({ api: todoApi, actions }),
 *   [actions],
 * );
 * await service.fetchTodos();
 */
export const createTodoService = (deps: TodoServiceDeps) => {
  const { api, actions } = deps;

  return {
    /**
     * @description APIからTodoリストを取得してStoreに反映
     */
    async fetchTodos(): Promise<void> {
      actions.setLoading(true);
      actions.setError(null);

      try {
        const todos = await api.fetchAll();
        actions.setTodos(todos);
      } catch (error) {
        actions.setError(
          error instanceof Error ? error.message : 'Unknown error',
        );
      } finally {
        actions.setLoading(false);
      }
    },

    /**
     * @description Todoを作成してAPIに保存
     */
    async createTodo(payload: {
      title: string;
      description?: string;
      dueDate: string;
    }): Promise<void> {
      actions.setLoading(true);

      try {
        const created = await api.create({
          title: payload.title,
          description: payload.description ?? '',
          status: 'pending',
          dueDate: payload.dueDate,
        });
        // Store actionを使用して状態更新
        actions.createTodo({
          title: created.title,
          description: created.description,
          dueDate: created.dueDate,
        });
      } catch (error) {
        actions.setError(
          error instanceof Error ? error.message : 'Failed to create todo',
        );
      } finally {
        actions.setLoading(false);
      }
    },

    /**
     * @description TodoステータスをAPI経由で更新
     */
    async updateTodoStatus(
      id: string,
      status: 'pending' | 'in_progress' | 'completed',
    ): Promise<void> {
      try {
        await api.update(id, { status });
        actions.updateTodo({ id, status });
      } catch (error) {
        actions.setError(
          error instanceof Error ? error.message : 'Failed to update todo',
        );
      }
    },

    /**
     * @description TodoをAPI経由で削除
     */
    async deleteTodo(id: string): Promise<void> {
      try {
        await api.delete(id);
        actions.deleteTodo(id);
      } catch (error) {
        actions.setError(
          error instanceof Error ? error.message : 'Failed to delete todo',
        );
      }
    },

    /**
     * @description 複数Todoを一括完了（Optimistic Update）
     */
    async completeTodosBatch(ids: string[]): Promise<void> {
      // Optimistic update
      actions.completeTodos(ids);

      try {
        // API呼び出し（並列）
        await Promise.all(
          ids.map((id) => api.update(id, { status: 'completed' })),
        );
      } catch (error) {
        // Rollback: 再取得
        await this.fetchTodos();
        actions.setError('Failed to complete todos');
      }
    },
  };
};

/** @description Service singleton type */
export type TodoService = ReturnType<typeof createTodoService>;
```

### 4. API Integration

```typescript
// api/todoApi.ts
import type { TodoParams } from '../models/todo';
import type { TodoApi } from '../services/types';

const API_BASE = '/api/todos';

/** @description Todo APIクライアント（TodoApiを実装） */
export const todoApi: TodoApi = {
  async fetchAll(): Promise<TodoParams[]> {
    const response = await fetch(API_BASE);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }
    return response.json();
  },

  async create(
    payload: Omit<TodoParams, 'id' | 'createdAt'>,
  ): Promise<TodoParams> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.statusText}`);
    }
    return response.json();
  },

  async update(id: string, payload: Partial<TodoParams>): Promise<TodoParams> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.statusText}`);
    }
  },
};
```

### 5. Custom Hooks

Feature固有のカスタムフック。ServiceとStoreを組み合わせて使用。

> **IMPORTANT**: Custom Hooksでは`useEffect`等の副作用を宣言しない。
> Hooksは値やコールバックの宣言のみを行い、`useEffect`などの副作用は必ずコンポーネント側（page.tsx）で扱うこと。

```typescript
// hooks/useTodoFeature.ts
import { useCallback, useMemo } from 'react';

import { TodoStore } from '../stores/todo';
import { createTodoService } from '../services/todoService';
import { todoApi } from '../api/todoApi';

/**
 * @description Todo Feature Hook
 * @example
 * const { todos, createTodo, isLoading } = useTodoFeature();
 */
export const useTodoFeature = () => {
  const { queries, actions } = TodoStore.useStore();

  // Service instance with actions injected
  const service = useMemo(
    () => createTodoService({ api: todoApi, actions }),
    [actions],
  );

  // Queries
  const todos = queries.todoList;
  const selectedTodo = queries.selectedTodo;
  const overdueTodos = queries.overdueTodos;
  const completionRate = queries.completionRate;
  const isLoading = queries.isLoading;
  const error = queries.error;

  // Memoized filtered queries
  const pendingTodos = useMemo(
    () => queries.todosByStatus('pending'),
    [queries],
  );
  const completedTodos = useMemo(
    () => queries.todosByStatus('completed'),
    [queries],
  );

  // Service methods (async operations with API)
  const fetchTodos = useCallback(() => service.fetchTodos(), [service]);
  const createTodo = useCallback(
    (payload: { title: string; description?: string; dueDate: string }) =>
      service.createTodo(payload),
    [service],
  );
  const updateTodoStatus = useCallback(
    (id: string, status: 'pending' | 'in_progress' | 'completed') =>
      service.updateTodoStatus(id, status),
    [service],
  );
  const deleteTodo = useCallback(
    (id: string) => service.deleteTodo(id),
    [service],
  );

  // Local actions (no API)
  const selectTodo = useCallback(
    (id: string | null) => actions.selectTodo(id),
    [actions],
  );
  const clearError = useCallback(() => actions.clearError(), [actions]);

  return {
    // Queries
    todos,
    selectedTodo,
    overdueTodos,
    pendingTodos,
    completedTodos,
    completionRate,
    isLoading,
    error,
    // Service methods (async with API)
    fetchTodos,
    createTodo,
    updateTodoStatus,
    deleteTodo,
    // Local actions
    selectTodo,
    clearError,
  };
};
```

### 6. Page Component

> **IMPORTANT**: `useEffect`などの副作用は必ずページコンポーネント（page.tsx）側で扱うこと。Custom Hooksには副作用を含めない。

#### Directory Structure

```
pages/
└── <PageName>/
    ├── index.ts        # re-export
    ├── page.tsx        # Page component本体（JSX + useEffect等の副作用）
    └── style.ts        # Page styles
```

- `index.ts`: re-exportのみ。`style.ts`が存在する場合、`page.tsx`が必須。
- `page.tsx`: ページ本体。JSXと副作用（useEffect等）を含む。
- `style.ts`: スタイル定義。不要なら省略可。

#### Step 1: Page Styles

```typescript
// pages/TodoList/style.ts
import { styled } from '@/utils/ui/styled';

export const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const Header = styled('header')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const ErrorMessage = styled('div')({
  color: '#e53935',
  padding: '1rem',
  backgroundColor: '#ffebee',
  borderRadius: '4px',
  cursor: 'pointer',
});
```

#### Step 2: Page Component

```typescript
// pages/TodoList/page.tsx
import { useEffect } from 'react';

import { useTodoFeature } from '../../hooks/useTodoFeature';
import { TodoList } from '../../components/TodoList';
import { TodoForm } from '../../components/TodoForm';
import { TodoStats } from '../../components/TodoStats';

import { Container, Header, ErrorMessage } from './style';

export const TodoListPage = () => {
  const {
    todos,
    completionRate,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodoStatus,
    deleteTodo,
    clearError,
  } = useTodoFeature();

  // Side effects belong in the page component, NOT in hooks
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <Container>
      <Header>
        <h1>Todo List</h1>
        <TodoStats completionRate={completionRate} totalCount={todos.length} />
      </Header>

      {error && (
        <ErrorMessage onClick={clearError}>
          {error} (クリックして閉じる)
        </ErrorMessage>
      )}

      <TodoForm onSubmit={createTodo} isLoading={isLoading} />

      <TodoList
        todos={todos}
        onStatusChange={updateTodoStatus}
        onDelete={deleteTodo}
        isLoading={isLoading}
      />
    </Container>
  );
};
```

#### Step 3: Index (re-export)

```typescript
// pages/TodoList/index.ts
export { TodoListPage } from './page';
```

## Naming Conventions

| Category        | Convention              | Example             |
| --------------- | ----------------------- | ------------------- |
| Schema          | `{entity}Schema`        | `todoSchema`        |
| Params Type     | `{Entity}Params`        | `TodoParams`        |
| Model Type      | `{Entity}`              | `Todo`              |
| Model Factory   | `create{Entity}`        | `createTodo`        |
| Empty Check     | `is{Entity}Empty`       | `isTodoEmpty`       |
| Store           | `{Entity}Store`         | `TodoStore`         |
| State Type      | `{Entity}State`         | `TodoState`         |
| Service Factory | `create{Entity}Service` | `createTodoService` |
| Service Type    | `{Entity}Service`       | `TodoService`       |
| API Type        | `{Entity}Api`           | `TodoApi`           |
| API Client      | `{entity}Api`           | `todoApi`           |
| Hook            | `use{Feature}`          | `useTodoFeature`    |
| Page Component  | `{Page}Page`            | `TodoListPage`      |

## Layer Responsibilities

| Layer     | Responsibility                                                           | Dependencies       |
| --------- | ------------------------------------------------------------------------ | ------------------ |
| Model     | ドメインロジック、バリデーション、computed props                         | Zod, utils         |
| Store     | 状態管理、Commands(actions)、Queries                                     | Model (types only) |
| Service   | API統合、複数action orchestration、DI                                    | Store, API         |
| API       | HTTP通信、外部サービス連携                                               | なし               |
| Hook      | React integration、Service/Store利用（値・コールバックのみ、副作用なし） | Store, Service     |
| Component | UI表示、ユーザーインタラクション、副作用（useEffect等）                  | Hook               |

## Best Practices

### Model Guidelines (createModelFactory)

1. **Schema First**: 必ずZodスキーマから始める
2. **Params = Raw Data**: APIレスポンス/Store保存用の型
3. **Extension for Logic**: getterとメソッドでドメインロジックを定義
4. **Helper Functions**: 静的メソッド相当は外部関数として定義

### Store Guidelines (i-state)

1. **Store Raw Data**: stateにはParams（生データ）を保存
2. **Query → Model**: QueriesでDomain Modelに変換して返す
3. **Actions = Commands**: 状態変更は全てactionsで行う
4. **JSDoc @command**: action にCommandとしての役割を明示

### Service Guidelines

1. **Orchestration**: 複数のstore actionを組み合わせる
2. **API Integration**: 外部API呼び出しはServiceで行う
3. **DI via Factory**: `createXxxService(deps)`パターンでDI
4. **Error Handling**: try/catchでエラーをstoreに反映

## Testing Strategy

### Domain Model Tests

```typescript
// models/Todo.test.ts
import { describe, it, expect } from 'vitest';

import { createTodo, isTodoEmpty, type TodoParams } from './Todo';

describe('Todo Model', () => {
  const validParams: TodoParams = {
    id: '1',
    title: 'Test Todo',
    description: 'Description',
    status: 'pending',
    dueDate: '2024-12-31T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
  };

  describe('createTodo', () => {
    it('should create a valid Todo model', () => {
      const todo = createTodo(validParams);
      expect(todo.id).toBe('1');
      expect(todo.title).toBe('Test Todo');
      expect(todo.statusLabel).toBe('未着手');
    });

    it('should throw ZodError for invalid params', () => {
      expect(() => createTodo({ ...validParams, id: '' })).toThrow();
    });

    it('should be immutable', () => {
      const todo = createTodo(validParams);
      expect(() => {
        (todo as any).title = 'Changed';
      }).toThrow();
    });
  });

  describe('computed properties', () => {
    it('isOverdue should return true for past due date', () => {
      const todo = createTodo({
        ...validParams,
        dueDate: '2020-01-01T00:00:00Z',
      });
      expect(todo.isOverdue).toBe(true);
    });

    it('isOverdue should return false for completed todo', () => {
      const todo = createTodo({
        ...validParams,
        dueDate: '2020-01-01T00:00:00Z',
        status: 'completed',
      });
      expect(todo.isOverdue).toBe(false);
    });

    it('withStatus should return new params with updated status', () => {
      const todo = createTodo(validParams);
      const updated = todo.withStatus('completed');
      expect(updated.status).toBe('completed');
      expect(updated.id).toBe(validParams.id);
    });
  });

  describe('isTodoEmpty', () => {
    it('should return true for empty id', () => {
      expect(isTodoEmpty({ id: '' })).toBe(true);
    });

    it('should return false for valid params', () => {
      expect(isTodoEmpty(validParams)).toBe(false);
    });
  });
});
```

### Service Tests (with Mock DI)

```typescript
// services/todoService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { createTodoService } from './todoService';
import type { TodoApi, TodoActions } from './types';

describe('TodoService', () => {
  const mockApi: TodoApi = {
    fetchAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockActions: TodoActions = {
    setTodos: vi.fn(),
    createTodo: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn(),
    completeTodos: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTodos', () => {
    it('should fetch and set todos', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Test',
          description: '',
          status: 'pending' as const,
          dueDate: '2024-12-31T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];
      vi.mocked(mockApi.fetchAll).mockResolvedValue(mockTodos);

      const service = createTodoService({ api: mockApi, actions: mockActions });
      await service.fetchTodos();

      expect(mockActions.setLoading).toHaveBeenCalledWith(true);
      expect(mockActions.setTodos).toHaveBeenCalledWith(mockTodos);
      expect(mockActions.setError).toHaveBeenCalledWith(null);
      expect(mockActions.setLoading).toHaveBeenLastCalledWith(false);
    });

    it('should set error on fetch failure', async () => {
      vi.mocked(mockApi.fetchAll).mockRejectedValue(new Error('Network error'));

      const service = createTodoService({ api: mockApi, actions: mockActions });
      await service.fetchTodos();

      expect(mockActions.setError).toHaveBeenCalledWith('Network error');
    });
  });
});
```

## Anti-Patterns to Avoid

### DON'T

1. **classを使用する**: createModelFactoryを使う
2. **commandsディレクトリ**: Store actionsがその役割
3. **Storeに直接API呼び出し**: Serviceで行う
4. **Mutableな状態**: createModelFactoryは自動でfreeze
5. **型の緩和**: `as any`や`@ts-ignore`を使用しない
6. **Hooksに副作用を含める**: `useEffect`等の副作用はコンポーネント側（page.tsx）で扱う

### DO

1. **Zod Schema First**: バリデーションを最初に定義
2. **Store = Raw Data**: stateにはParams型を保存
3. **Service for Orchestration**: 複数操作はServiceで
4. **DI Pattern**: テスト容易性のためcreate関数でDI
5. **Immutable Updates**: withXxxメソッドで新しいParamsを返す

## Related Skills

- **domain-model**: createModelFactoryの詳細な使い方
- **feature-scaffold**: ボイラープレート生成
- **tdd-guide**: テスト駆動開発でDomain Modelを実装
- **frontend-design**: UIコンポーネントの高品質な実装
- **git-master**: Atomic commitsでの変更管理

## References

- [createModelFactory](../../utils/model/createModel.ts): イミュータブルモデルファクトリ
- [i-state README](../../utils/i-state/README.md): Zustandベースの状態管理ライブラリ
- [AGENTS.md](../../AGENTS.md): リポジトリ全体のコーディング規約
