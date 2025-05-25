// Store作成時に設定値として注釈される型
export type StateProps = Record<string, any>;

export type QueriesProps<S extends StateProps> = Record<string, (state: S) => any>;

type Context<S extends StateProps, Q extends QueriesProps<S>> = {
  state: S;
  queries: StoreQueries<Q>;
  dispatch: Dispatch<S>;
};

export type Actions<S extends StateProps, Q extends QueriesProps<S>> = {
  [key: string]: (context: Context<S, Q>, ...args: any[]) => void | Promise<void>;
};

export type Dispatch<S extends StateProps> = <K extends keyof S>(key: K, value: S[K]) => void;

// Storeから提供される型

export type StoreQueries<Q extends QueriesProps<any>> = {
  [K in keyof Q]: ReturnType<Q[K]>
}

export type StoreActions<S extends StateProps, Q extends QueriesProps<S>, A extends Actions<S, Q>> = {
  [K in keyof A]: A[K] extends (context: any, ...args: infer P) => any 
    ? (...args: P) => ReturnType<A[K]> 
    : never;
};

export type Store<S extends StateProps, Q extends QueriesProps<S>, A extends Actions<S, Q>> = {
  useStore: () => {
    state: S;
    queries: StoreQueries<Q>;
    actions: StoreActions<S, Q, A>;
  };
};
