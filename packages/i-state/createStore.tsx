import { useCallback, useState, useMemo } from "react"

import { State, Queries, Actions, Dispatch, StoreProps, CreateStoreReturn, UseStoreReturn} from './type';

export const createStore = <
  S extends State,
  Q extends Queries<S>,
  A extends Actions<S>
>(storeConfig: StoreProps<S, Q, A>): CreateStoreReturn<S, Q, A> => {

  const initialState = typeof storeConfig.state === 'function'
    ? (storeConfig.state as () => S)()
    : storeConfig.state;

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

  return {
    useStore
  };
};
