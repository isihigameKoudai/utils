// Store作成時に設定値として注釈される型
export type State = Record<string, any>;

export type Queries<S extends State> = Record<string, (state: S) => any>;

type Context<S extends State, Q extends Queries<S>> = {
  state: S;
  queries: StoreQueries<Q>;
  dispatch: Dispatch<S>;
};

export type Actions<S extends State, Q extends Queries<S>> = {
  [key: string]: (context: Context<S, Q>, ...args: any[]) => void | Promise<void>;
};

export type Dispatch<S extends State> = <K extends keyof S>(key: K, value: S[K]) => void;

// Storeから提供される型

export type StoreQueries<Q extends Queries<any>> = {
  [K in keyof Q]: ReturnType<Q[K]>
}

export type StoreActions<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  [K in keyof A]: A[K] extends (context: any, ...args: infer P) => any 
    ? (...args: P) => ReturnType<A[K]> 
    : never;
};

export type Store<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  useStore: () => {
    state: S;
    queries: StoreQueries<Q>;
    actions: StoreActions<S, Q, A>;
  };
};
