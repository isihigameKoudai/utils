import type { Lifetime, Token } from './type';

interface Registration<T> {
  readonly factory: (container: Container) => T;
  readonly lifetime: Lifetime;
  instance?: T;
}

/**
 * 型安全な DI コンテナ。
 *
 * ファクトリー関数を登録し、Token<T> で型安全に解決する。
 * クラスデコレータや reflect-metadata には依存しない。
 *
 * @example
 * ```ts
 * const container = new Container();
 *
 * container.register(LoggerToken, () => new ConsoleLogger(), 'singleton');
 * container.register(UserServiceToken, (c) => new UserService(c.resolve(LoggerToken)));
 *
 * const userService = container.resolve(UserServiceToken);
 * //    ^? UserService — コンパイル時に型が保証される
 * ```
 *
 * ### 拡張のヒント
 * - **循環参照検知**: `resolve()` 内で解決中スタック (`Set<symbol>`) を管理し、
 *   同一トークンの再帰呼び出しを検出して `Error` を投げる。
 * - **Scoped ライフタイム**: リクエストスコープなどが必要な場合、
 *   子コンテナ (`createScope()`) を導入する設計が一般的。
 * - **React 連携**: `useInjection` フックで Context 経由のコンテナ参照を提供できる。
 *   （usage-example.ts を参照）
 */
export class Container {
  private readonly registrations = new Map<symbol, Registration<unknown>>();

  private readonly resolvingStack = new Set<symbol>();

  /**
   * 依存をコンテナに登録する。
   *
   * @template T トークンの型パラメータから自動推論される
   * @param token 依存を識別するトークン
   * @param factory 依存を生成するファクトリー関数。引数にコンテナ自身を受け取る。
   * @param lifetime ライフタイム（デフォルト: `'transient'`）
   * @example
   * ```ts
   * container.register(LoggerToken, () => new ConsoleLogger(), 'singleton');
   * container.register(UserServiceToken, (c) => {
   *   return new UserService(c.resolve(LoggerToken), c.resolve(DbToken));
   * });
   * ```
   */
  register<T>(
    token: Token<T>,
    factory: (container: Container) => T,
    lifetime: Lifetime = 'transient',
  ): void {
    this.registrations.set(token as symbol, {
      factory: factory as (container: Container) => unknown,
      lifetime,
    });
  }

  /**
   * 登録済みの依存を解決して返す。
   *
   * - `singleton` の場合はキャッシュから返す（初回はファクトリー実行）。
   * - `transient` の場合は毎回ファクトリーを実行する。
   *
   * @template T トークンの型パラメータから自動推論される
   * @param token 解決対象のトークン
   * @returns 解決された依存のインスタンス
   * @throws {Error} トークンが未登録の場合
   * @example
   * ```ts
   * const logger = container.resolve(LoggerToken);
   * //    ^? Logger
   * ```
   */
  resolve<T>(token: Token<T>): T {
    const registration = this.registrations.get(token as symbol);

    if (!registration) {
      throw new Error(
        `[DI] Token "${token.toString()}" is not registered. ` +
          'Did you forget to call container.register()?',
      );
    }

    if (
      registration.lifetime === 'singleton' &&
      registration.instance !== undefined
    ) {
      return registration.instance as T;
    }

    const sym = token as symbol;

    if (this.resolvingStack.has(sym)) {
      const chain = [...this.resolvingStack, sym]
        .map((s) => s.toString())
        .join(' → ');
      throw new Error(`[DI] Circular dependency detected: ${chain}`);
    }

    this.resolvingStack.add(sym);
    try {
      const instance = registration.factory(this);

      if (registration.lifetime === 'singleton') {
        registration.instance = instance;
      }

      return instance as T;
    } finally {
      this.resolvingStack.delete(sym);
    }
  }

  /**
   * 複数のトークンをまとめて解決する。
   *
   * タプル型を維持するため、戻り値の各要素は対応するトークンの型になる。
   *
   * @param tokens 解決対象のトークン配列
   * @returns 解決された依存のタプル
   * @example
   * ```ts
   * const [logger, db] = container.resolveAll(LoggerToken, DbToken);
   * //     ^? Logger    ^? DbClient
   * ```
   */
  resolveAll<Tokens extends readonly Token<unknown>[]>(
    ...tokens: [...Tokens]
  ): { [I in keyof Tokens]: Tokens[I] extends Token<infer U> ? U : never } {
    return tokens.map((token) => this.resolve(token)) as {
      [I in keyof Tokens]: Tokens[I] extends Token<infer U> ? U : never;
    };
  }

  /**
   * トークンが登録済みかどうかを確認する。
   *
   * @param token 確認対象のトークン
   * @returns 登録済みなら `true`
   */
  has(token: Token<unknown>): boolean {
    return this.registrations.has(token as symbol);
  }

  /**
   * すべての登録を解除し、singleton キャッシュもクリアする。
   *
   * テスト時のリセットに便利。
   */
  clear(): void {
    this.registrations.clear();
  }
}
