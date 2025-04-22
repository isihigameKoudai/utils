export type State = Record<string, any>;

export type Queries<S extends State> = Record<string, (state: S) => any>;

export type Dispatch<S extends State> = <K extends keyof S>(key: K, value: S[K]) => void;

type ActionContext<S extends State, Q extends Queries<S>> = {
  state: S;
  queries: { [K in keyof Q]: ReturnType<Q[K]> };
  dispatch: Dispatch<S>;
};

type ActionFunction<S extends State, Q extends Queries<S>, T extends any[] = any[]> = 
  (context: ActionContext<S, Q>, ...args: T) => void | Promise<void>;

export type Actions<S extends State, Q extends Queries<S>> = {
  [key: string]: ActionFunction<S, Q, any[]>;
};

export type StoreActions<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  [K in keyof A]: A[K] extends (context: any, ...args: infer P) => any 
    ? (...args: P) => ReturnType<A[K]> 
    : never;
};

export type Store<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  useStore: () => {
    state: S;
    queries: { [K in keyof Q]: ReturnType<Q[K]> };
    actions: StoreActions<S, Q, A>;
  };
};
