import { useCallback, useState, useMemo } from "react"

import { State, Queries, Actions, ActionContext, Dispatch, StoreProps} from './type';

export const createStore = <
  S extends State,
  Q extends Queries<S>,
  A extends Actions<S>
>(storeConfig: StoreProps<S, Q, A>) => {
  const initialState = typeof storeConfig.state === 'function'
    ? (storeConfig.state as () => S)()
    : storeConfig.state;

  const useStore = () => {
    const [state, setState] = useState<S>(initialState);

    const dispatch: Dispatch<S> = useCallback((key, value) => {
      setState((prev) => Object.freeze({...prev, [key]: value}) as S);
    }, []);

    const queries = useMemo(() => {
      const queryEntries = Object.entries(storeConfig.queries || {});
      const queryObject = {} as { readonly [K in keyof Q]: ReturnType<Q[K]> };
      
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
        {} as { readonly [K in keyof A]: (...args: Parameters<A[K]> extends [ActionContext<S>, ...infer P] ? P : never) => void | Promise<void> }
      ));
    }, [state, dispatch, storeConfig.actions]);

    return {
      state,
      queries,
      actions
    }
  };

  return {
    useStore
  };
};
