export type State = Record<string, any>;

export type Queries<S extends State> = Record<string, (state: S) => any>;

export type ActionContext<S extends State, Q extends Queries<S>> = {
  state: S;
  queries: { [K in keyof Q]: ReturnType<Q[K]> };
  dispatch: <K extends keyof S>(key: K, value: S[K]) => void;
};

export type Actions<S extends State, Q extends Queries<S>> = Record<
  string,
  ((context: ActionContext<S, Q>, ...args: any[]) => void | Promise<void>)
>;

export type Store<S extends State, Q extends Queries<S>, A extends Actions<S, Q>> = {
  useStore: () => {
    state: S;
    queries: { [K in keyof Q]: ReturnType<Q[K]> };
    actions: { [K in keyof A]: A[K] extends (context: ActionContext<S,Q>, ...args: infer P) => void ? (...args: P) => void : () => void };
  };
};
