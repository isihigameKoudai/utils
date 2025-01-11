export type State = Record<string, any>;

export type Queries<S extends State> = Record<string, (state: S) => any>;

type Dispatch<S extends State> = <K extends keyof S>(key: K, value: S[K]) => void;

export type ActionContext<S extends State, Q extends Queries<S>> = {
  state: S;
  queries: { [K in keyof Q]: ReturnType<Q[K]> };
  dispatch: Dispatch<S>;
};

export type Actions<S extends State, Q extends Queries<S>> = Record<
  string,
  ((context: ActionContext<S, Q>, ...args: any[]) => void | Promise<void>)
>;

export type StoreActions<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  [K in keyof A]: A[K] extends (context: ActionContext<S,Q>, ...args: infer P) => void ? (...args: P) => void : () => void;
};

export type Store<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  useStore: () => {
    state: S;
    queries: { [K in keyof Q]: ReturnType<Q[K]> };
    actions: StoreActions<S, Q, A>;
  };
};
