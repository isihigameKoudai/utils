import type { Token } from './type';

/**
 * 新しい DI トークンを生成する。
 *
 * @template T トークンが表す依存の型
 * @param description トークンの説明文字列（デバッグ用）
 * @returns 一意な `Token<T>`
 * @example
 * ```ts
 * const DbToken = createToken<DbClient>('DbClient');
 * ```
 */
export const createToken = <T>(description: string): Token<T> => {
  return Symbol(description) as Token<T>;
};
