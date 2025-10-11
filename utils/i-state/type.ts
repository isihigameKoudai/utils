// Store作成時に設定値として注釈される型
export type StateProps = Record<string, any>;

export type QueriesProps<S extends StateProps> = Record<
  string,
  (state: S) => any
>;

export type Context<S extends StateProps, Q extends QueriesProps<S>> = {
  state: S;
  queries: Queries<Q>;
  dispatch: Dispatch<S>;
};

export type ActionsProps<S extends StateProps, Q extends QueriesProps<S>> = {
  [key: string]: (
    context: Context<S, Q>,
    ...args: any[]
  ) => void | Promise<void>;
};

export type Dispatch<S extends StateProps> = <K extends keyof S>(
  key: K,
  value: S[K],
) => void;

// Storeから提供される型

export type Queries<Q extends QueriesProps<any>> = {
  [K in keyof Q]: ReturnType<Q[K]>;
};

export type Actions<
  S extends StateProps,
  Q extends QueriesProps<S>,
  A extends ActionsProps<S, Q>,
> = {
  [K in keyof A]: A[K] extends (context: Context<S, Q>, ...args: infer P) => any
    ? (...args: P) => ReturnType<A[K]>
    : never;
};
