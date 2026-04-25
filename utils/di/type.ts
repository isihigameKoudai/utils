/**
 * DI コンテナで依存を識別するための Branded Symbol 型。
 *
 * 型パラメータ `T` によって、`resolve()` の戻り値がコンパイル時に保証される。
 *
 * @template T トークンが表す依存の型
 * @example
 * ```ts
 * interface Logger { info(msg: string): void; }
 * const LoggerToken = createToken<Logger>('Logger');
 * ```
 */
export type Token<T = unknown> = symbol & {
  readonly __brand: 'DI_TOKEN';
  readonly __type: T;
};

/**
 * 依存のライフタイム。
 *
 * - `singleton` — 初回 `resolve()` 時にインスタンスを生成しキャッシュ。以降は同一参照を返す。
 * - `transient` — `resolve()` のたびに新しいインスタンスを生成する。
 */
export type Lifetime = 'singleton' | 'transient';

/**
 * コンテナに登録する依存の型マップ。
 *
 * 使用時に具体的な型を定義しておくと、Token 生成との対応が明確になる。
 *
 * @example
 * ```ts
 * type Services = {
 *   Logger: Logger;
 *   DbClient: DbClient;
 *   UserService: UserService;
 * };
 * ```
 *
 * **注意**: このプロジェクトでは Token<T> の型パラメータで型安全を保証するため、
 * TypeMap を Container のジェネリクスとして渡す必要はない。
 * TypeMap は「どの依存が存在するか」を文書化する目的で使用する。
 */
export type TypeMap = Record<string, unknown>;
