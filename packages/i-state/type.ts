/** ストアの状態を表す型、読み取り専用 */
export type State = Record<string, unknown>;

/** 初期状態を表す型。直接のオブジェクトか状態を返す関数 */
export type StateOrStateFn<S extends State> = S | (() => S);

/** クエリ関数の型。状態を受け取り、何らかの値を返す */
export type Queries<S extends State> = {
  [key: string]: (state: S) => unknown;
};

/** アクションのコンテキスト。現在の状態とディスパッチ関数を含む */
export type ActionContext<S extends State> = { 
  state: S; 
  dispatch: Dispatch<S> 
};

/** アクション関数の型。コンテキストと任意の引数を受け取る */
export type Actions<S extends State> = {
  [key: string]: (context: ActionContext<S>, ...args: any[]) => void;
};

/** ディスパッチ関数の型。状態の特定のキーに対して新しい値をセット */
export type Dispatch<S extends State> = <K extends keyof S>(key: K, value: S[K]) => void;

/** ストア作成時に必要なプロパティの型 */
export interface StoreProps<S extends State> {
  state: StateOrStateFn<S>;
  queries?: Queries<S>;
  actions: Actions<S>;
}

/** useStoreの戻り値の型 */
export type UseStoreReturn<S extends State, Q extends Queries<S>, A extends Actions<S>> = {
  state: Readonly<S>;
  queries: { readonly [K in keyof Q]: ReturnType<Q[K]> };
  actions: { readonly [K in keyof A]: (...args: Parameters<A[K]> extends [ActionContext<S>, ...infer P] ? P : never) => void | Promise<void> };
};

/** createStoreの戻り値の型 */
export type CreateStoreReturn<S extends State, Q extends Queries<S>, A extends Actions<S>> = {
  useStore: () => UseStoreReturn<S, Q, A>;
  useStoreContainer: () => UseStoreReturn<S, Q, A>;
  Provider: React.FC<{ children: React.ReactNode }>;
};
