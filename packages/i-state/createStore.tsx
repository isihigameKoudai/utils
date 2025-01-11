import React from 'react';
import { useCallback, useState, useMemo, createContext, useContext, ReactNode } from "react"

import { State, Queries, Actions, Dispatch, StoreProps, CreateStoreReturn, UseStoreReturn} from './type';

/**
* ステート管理、クエリ、アクションを含むストアを作成する
* @template S - ベースのStateを拡張したステート型
* @template Q - ベースのQueriesを拡張したクエリ型
* @template A - ベースのActionsを拡張したアクション型
* @param {StoreProps<S, Q, A>} storeConfig - ストアの設定オブジェクト
* @param {S | (() => S)} storeConfig.state - 初期ステートまたは初期ステートを返す関数
* @param {Q} [storeConfig.queries] - クエリ関数を含むオブジェクト
* @param {A} storeConfig.actions - アクション関数を含むオブジェクト
* @returns {CreateStoreReturn<S, Q, A>} useStoreフック、Providerコンポーネント、useStoreContainerフックを含むストアオブジェクト
* @example
* const store = createStore({
*   state: { count: 0 },
*   queries: {
*     doubled: (state) => state.count * 2
*   },
*   actions: {
*     increment: ({ state, dispatch }) => dispatch('count', state.count + 1)
*   }
* })
*/
export const createStore = <
  S extends State,
  Q extends Queries<S>,
  A extends Actions<S>
>(storeConfig: StoreProps<S, Q, A>): CreateStoreReturn<S, Q, A> => {

  const initialState = typeof storeConfig.state === 'function'
    ? (storeConfig.state as () => S)()
    : storeConfig.state;

  const StoreContext = createContext<UseStoreReturn<S, Q, A> | null>(null);

  const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const store = useStore();
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
  };
  
  const useStore = (): UseStoreReturn<S, Q, A> => {
    const [state, setState] = useState<S>(initialState);

    const dispatch: Dispatch<S> = useCallback((key, value) => {
      setState((prev) => Object.freeze({...prev, [key]: value}) as S);
    }, []);

    const queries = useMemo(() => {
      const queryEntries = Object.entries(storeConfig.queries || {});
      const queryObject = {} as ReturnType<CreateStoreReturn<S, Q, A>['useStore']>['queries'];
      queryEntries.forEach(([key, query]) => {
        Object.defineProperty(queryObject, key, {
          get: () => Object.freeze(query(state)),
          enumerable: true,
        });
      });

      return Object.freeze(queryObject);
    }, [state, storeConfig.queries]);

    const actions = useMemo(() => {
      return Object.freeze(Object.entries(storeConfig.actions).reduce(
        (acc, [key, action]) => ({
          ...acc,
          [key]: (...args: any[]) => action({ state, dispatch }, ...args)
        }),
        {} as ReturnType<CreateStoreReturn<S, Q, A>['useStore']>['actions']
      ));
    }, [state, dispatch, storeConfig.actions]);

    return {
      state,
      queries,
      actions
    }
  };

  const useStoreContainer = (): UseStoreReturn<S, Q, A> => {
    const context = useContext(StoreContext);
    if (!context) {
      throw new Error('useStoreContainer must be used within a Provider');
    }
    return context;
  };

  return {
    useStore,
    Provider,
    useStoreContainer
  };
};
