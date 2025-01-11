import React from 'react';

import { useCallback, useState } from 'react';

import { State, Queries, Actions, Store } from './type';

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

  return {
    useStore: () => {
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

      const context = { state, queries, dispatch };

      const actions = Object.entries(actionFns).reduce(
        (acc, [key, fn]) => ({
          ...acc,
          [key]: (...args: any[]) => fn(context, ...args),
        }),
        {} as { [K in keyof A]: A[K] extends (context: any, ...args: infer P) => void ? (...args: P) => void : () => void }
      );

      return { state, queries, actions };
    },
  };
};

