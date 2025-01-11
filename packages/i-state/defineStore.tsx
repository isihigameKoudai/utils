import React from 'react';

import { useCallback, useState, createContext } from 'react';

import { State, Queries, Actions, Store, ActionContext, StoreActions } from './type';

const EMPTY: unique symbol = Symbol();

export const defineStore = <
  S extends State,
  Q extends Queries<S>,
  A extends Actions<S, Q>
>(config: {
  state: S;
  queries: Q;
  actions: A;
}): Store<S, Q, A> => {
  const { state: initialState, queries: queryFns, actions: actionFns } = config;
  
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

  const useContainer = () => {
    const store = React.useContext(Context);
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

