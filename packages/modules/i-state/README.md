# i-state

シンプルなReact用状態管理ライブラリ。コンポーネント間で状態を共有するためのフックベースのソリューションを提供します。
Vuexのstate/getters/actionsパターンからインスピレーションを得ています。

## 特徴

- 軽量でシンプルな実装
- React Hooksとの完全な互換性
- TypeScriptによる型安全性
- Vuex風のstate/queries(getters)/actionsパターン
- クエリによる派生状態の計算
- アクションによる状態更新

## 基本的な使い方

### ストアの作成

```typescript
import { createStore } from 'i-state';

interface State {
  count: number;
}

// Vuex風の構造
const counterStore = createStore<State, {}, {}>({
  // state - 状態
  state: {
    count: 0
  },
  // queries (≒ Vuexのgetters) - 派生状態
  queries: {
    doubleCount: (state) => state.count * 2
  },
  // actions - 状態更新
  actions: {
    increment: ({ state, dispatch }) => {
      dispatch('count', state.count + 1);
    },
    decrement: ({ state, dispatch }) => {
      dispatch('count', state.count - 1);
    }
  }
});
```

### コンポーネントでの使用

```typescript
const Counter = () => {
  const { state, queries, actions } = counterStore.useStore();

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Double Count: {queries.doubleCount}</p>
      <button onClick={actions.increment}>+</button>
      <button onClick={actions.decrement}>-</button>
    </div>
  );
};
```

## API

### createStore

```typescript
function createStore<S extends State, Q extends Queries<S>, A extends Actions<S>>(
  config: StoreProps<S, Q, A>
): CreateStoreReturn<S, Q, A>
```

#### パラメータ
- `state`: 初期状態またはそれを返す関数
- `queries`: 状態から派生した値を計算する関数のオブジェクト（オプショナル）
- `actions`: 状態を更新するアクション関数のオブジェクト

#### 戻り値
- `useStore`: フックを返す関数。以下のオブジェクトを返します：
  - `state`: 現在の状態
  - `queries`: 計算された派生状態
  - `actions`: ディスパッチ可能なアクション

## 注意点

- アクションを通じてのみ状態を更新できます
- クエリは状態が変更されるたびに再計算されます
- すべての状態更新は`dispatch`関数を通じて行う必要があります

## ライセンス

MIT
