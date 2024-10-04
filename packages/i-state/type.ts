/** ストアの状態を表す型、読み取り専用 */
export type State = Readonly<Record<string, unknown>>;

/** 初期状態を表す型。直接のオブジェクトか状態を返す関数 */
export type StateOrStateFn<S extends State> = S | (() => S);

/** クエリ関数の型。状態を受け取り、何らかの値を返す */
export type Queries<S extends State> = {
  [key: string]: (state: S) => unknown;
};

/** ディスパッチ関数の型。状態の特定のキーに対して新しい値をセット */
export type Dispatch<S extends State> = <K extends keyof S>(key: K, value: S[K]) => void;

/** アクションのコンテキスト。現在の状態とディスパッチ関数を含む */
export type ActionContext<S extends State> = { state: S; dispatch: Dispatch<S> };

/** アクション関数の型。コンテキストと任意の引数を受け取る */
export type Actions<S extends State> = {
  [key: string]: (context: ActionContext<S>, ...args: any[]) => void;
};

/** ストア作成時に必要なプロパティの型 */
export interface StoreProps<S extends State, Q extends Queries<S>, A extends Actions<S>> {
  /** 初期状態またはそれを返す関数 */
  state: StateOrStateFn<S>;
  /** オプショナルなクエリ関数のオブジェクト */
  queries?: Q;
  /** アクション関数のオブジェクト */
  actions: A;
}

export type UseStoreReturn<S extends State, Q extends Queries<S>, A extends Actions<S>> = {
  state: S;
  queries: { readonly [K in keyof Q]: ReturnType<Q[K]> };
  actions: { readonly [K in keyof A]: (...args: Parameters<A[K]> extends [ActionContext<S>, ...infer P] ? P : never) => void | Promise<void> };
};

export type CreateStoreReturn<S extends State, Q extends Queries<S>, A extends Actions<S>> = {
  useStore: () => UseStoreReturn<S, Q, A>;
}
