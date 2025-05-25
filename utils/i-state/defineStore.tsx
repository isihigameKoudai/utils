/**
 * npm i zustand
 */
import { create } from 'zustand';

import { StateProps, QueriesProps, ActionsProps, Store, StoreActions, Dispatch, StoreQueries } from './type';

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
 * 
 * @example
 * const CounterStore = defineStore({
 *   state: { count: 0 },
 *   queries: {
 *     doubleCount: (state) => state.count * 2
 *   },
 *   actions: {
 *     increment: ({ state, dispatch }) => dispatch('count', state.count + 1),
 *     incrementBy: ({ state, dispatch }, amount: number) => dispatch('count', state.count + amount)
 *   }
 * });
 * 
 * @example
 * type CounterState = {
 *  count: number;
 * }
 * 
 * const state: CounterState = {
 *  count: 0,
 * }
 * const queries = {
 *   doubleCount: (state) => state.count * 2
 * } satisfies Queries<CounterState>;
 * 
 * const actions = {
 *   increment: ({ state, dispatch }) => dispatch('count', state.count + 1),
 *   incrementBy: ({ state, dispatch }, amount: number) => dispatch('count', state.count + amount)
 * } satisfies Actions<CounterState, typeof queries>;
 * 
 * const CounterStore = defineStore<CounterState, typeof queries, typeof actions>({
 *   state,
 *   queries,
 *   actions
 * });
 * 
 * // ストアの使用
 * const Counter = () => {
 *   const { state, actions } = CounterStore.useStore();
 *   // actions.incrementBy(1) - OK
 *   // actions.incrementBy('1') - 型エラー
 *   return <button onClick={() => actions.incrementBy(1)}>{state.count}</button>;
 * };
 */
export const defineStore = <
  S extends StateProps,
  Q extends QueriesProps<S> = QueriesProps<S>,
  A extends ActionsProps<S, Q> = ActionsProps<S, Q>
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

  // ストアを使用するためのフック（型情報を保持）
  const useStore = () => {
    const { state, dispatch } = store();
    
    const queries = Object.entries(queryFns).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: fn(state),
      }),
      {} as StoreQueries<Q>
    ) satisfies StoreQueries<Q>;

    const actions = Object.entries(actionFns).reduce(
      (acc, [key, fn]) => ({
        ...acc,
        [key]: ((...args: any[]) => {
          return fn({
            state,
            queries,
            dispatch,
          }, ...args);
        }) as StoreActions<S, Q, A>[keyof A],
      }),
      {} as StoreActions<S, Q, A>
    ) satisfies StoreActions<S, Q, A>;

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

