import React from 'react';

import { useCallback, useState, createContext, useContext } from 'react';

import { State, Queries, Actions, Store, ActionContext, StoreActions } from './type';

const EMPTY: unique symbol = Symbol();

/**
 * ステート管理のためのストアを定義するファクトリ関数
 * @template S - ステートの型
 * @template Q - クエリの型
 * @template A - アクションの型
 * @param {Object} config - ストアの設定オブジェクト
 * @param {S} config.state - 初期ステート
 * @param {Q} config.queries - ステートから派生する値を計算するクエリ関数群
 * @param {A} config.actions - ステートを更新するアクション関数群
 * @returns {Object} ストアオブジェクト
 * @property {Function} useStore - フックとしてストアを使用するための関数
 * @property {React.FC} Provider - ストアのコンテキストを提供するプロバイダーコンポーネント
 * @property {Function} useStoreContainer - プロバイダー配下でストアにアクセスするためのフック
 * @example
 * const CounterStore = defineStore({
 *   state: { count: 0 },
 *   queries: {
 *     doubleCount: (state) => state.count * 2
 *   },
 *   actions: {
 *     increment: ({ state, dispatch }) => dispatch('count', state.count + 1)
 *   }
 * });
 * 
 * // Providerの使用
 * const App = () => (
 *   <CounterStore.Provider>
 *     <Counter />
 *   </CounterStore.Provider>
 * );
 * 
 * // ストアの使用
 * const Counter = () => {
 *   const { state, actions } = CounterStore.useStoreContainer();
 *   return <button onClick={actions.increment}>{state.count}</button>;
 * };
 */
export const defineStore = <
  S extends State,
  Q extends Queries<S> = Queries<S>,
  A extends Actions<S, Q> = Actions<S, Q>
>(config: {
  state: S;
  queries: Q;
  actions?: A;
}): Store<S, Q, A> => {
  const {
    state: initialState,
    queries: queryFns,
    actions: actionFns = {} as A,
  } = config;
  
  // ローカルステートとしてのストア
  const useStore = () => {
    const [state, setState] = useState<S>(initialState);

    const queries = Object.entries(queryFns).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: fn(state),
      }),
      {} as { [K in keyof Q]: ReturnType<Q[K]> }
    );

    const dispatch = useCallback(<K extends keyof S>(key: K, value: S[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    }, []);

    const context: ActionContext<S,Q> = { state, queries, dispatch };

    const actions = Object.entries(actionFns).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: (...args: any[]) => fn(context, ...args),
      }),
      {} as StoreActions<S, Q, A>
    );

    return { state, queries, actions };
  };

  const Context = createContext<ReturnType<typeof useStore> | typeof EMPTY>(EMPTY);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const store = useStore();
    return <Context.Provider value={store}>{children}</Context.Provider>;
  };

  // グローバルステートとしてのストア
  const useContainer = () => {
    const store = useContext(Context);
    if (store === EMPTY) {
      throw new Error('Component must be wrapped with <Store.Provider>');
    }
    return store;
  };
  
  return {
    useStore,
    useContainer,
    Provider,
  };
};

