import { create } from 'zustand';

import { State, Queries, Actions, Store, ActionContext, StoreActions, Dispatch } from './type';

/**
 * ステート管理のためのストアを定義するファクトリ関数（zustandベース）
 * @template S - ステートの型
 * @template Q - クエリの型
 * @template A - アクションの型
 * @param {Object} config - ストアの設定オブジェクト
 * @param {S} config.state - 初期ステート
 * @param {Q} config.queries - ステートから派生する値を計算するクエリ関数群
 * @param {A} config.actions - ステートを更新するアクション関数群
 * @returns {Object} ストアオブジェクト
 * @property {Function} useStore - フックとしてストアを使用するための関数
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
 * // ストアの使用
 * const Counter = () => {
 *   const { state, actions } = CounterStore.useStore();
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

  const store = create<{
    state: S;
    dispatch: Dispatch<S>;
  }>((set) => ({
    state: initialState,
    dispatch: <K extends keyof S>(key: K, value: S[K]) => {
      set((prev) => ({
        ...prev,
        state: { ...prev.state, [key]: value }
      }));
    }
  }));

  // ストアを使用するためのフック
  const useStore = () => {
    const { state, dispatch } = store();
    
    const queries = Object.entries(queryFns).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: fn(state),
      }),
      {} as { [K in keyof Q]: ReturnType<Q[K]> }
    );

    const actionContext: ActionContext<S, Q> = {
      state,
      queries,
      dispatch,
    };

    const actions = Object.entries(actionFns).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: (...args: any[]) => fn(actionContext, ...args),
      }),
      {} as StoreActions<S, Q, A>
    );

    return {
      state,
      queries,
      actions,
    };
  };
  
  return {
    useStore,
  };
};

