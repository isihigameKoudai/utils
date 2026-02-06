import { deepFreeze, createImmutableObject } from '@/utils/object/object';

import type { Config } from './type';

/**
 * イミュータブルなフロントエンドモデルを生成するファクトリ関数を作成する
 *
 * @description
 * - 完全にイミュータブルなモデルを生成
 * - Zodスキーマによるランタイムバリデーション
 * - Object.freezeによる深いフリーズ
 * - getterを使用した拡張プロパティの定義が可能（オプション）
 *
 * @template TParams - パラメータの型（Zodスキーマで検証される入力）
 * @template TModel - 最終的なモデルの型（TParams + 拡張プロパティ）
 *
 * @param config - ファクトリ設定
 * @returns モデル生成関数
 *
 * @example
 * ```ts
 * // 1. スキーマの定義
 * const userSchema = z.object({
 *   id: z.string(),
 *   firstName: z.string(),
 *   lastName: z.string(),
 *   age: z.number().min(0),
 * });
 *
 * // 2. パラメータ型
 * type UserParams = z.infer<typeof userSchema>;
 *
 * // 3. 完成したモデルの型定義
 * type User = UserParams & {
 *   readonly fullName: string;
 *   readonly isAdult: boolean;
 * };
 *
 * // 4. モデルファクトリの作成
 * const createUser = createModelFactory<UserParams, User>({
 *   schema: userSchema,
 *   extension: (params) => ({
 *     get fullName() { return `${params.firstName} ${params.lastName}`; },
 *     get isAdult() { return params.age >= 18; },
 *   }),
 * });
 *
 * // 5. モデルの生成（戻り値は User 型）
 * const user = createUser({
 *   id: '1',
 *   firstName: 'Taro',
 *   lastName: 'Yamada',
 *   age: 25,
 * });
 *
 * console.log(user.fullName); // 'Taro Yamada'
 * console.log(user.isAdult);  // true
 * user.age = 30; // エラー: 読み取り専用プロパティ
 * ```
 *
 * @example
 * ```ts
 * // 拡張なしのシンプルなモデル
 * const productSchema = z.object({
 *   id: z.string(),
 *   name: z.string(),
 *   price: z.number(),
 * });
 *
 * type Product = z.infer<typeof productSchema>;
 *
 * const createProduct = createModelFactory<Product>({
 *   schema: productSchema,
 * });
 */
export const createModelFactory = <
  Params extends Record<string, unknown>,
  Model extends Params = Params,
>(
  config: Config<Params, Model>,
): ((params: Params) => Readonly<Model>) => {
  const { schema, extension } = config;

  return (params: Params): Readonly<Model> => {
    // Zodによるバリデーション（失敗時は例外をスロー）
    const validatedParams = schema.parse(params);

    // ベースとなるイミュータブルオブジェクトを作成
    const frozenParams = deepFreeze(validatedParams);

    // 拡張プロパティがない場合はパラメータのみを返す
    if (!extension) {
      return frozenParams as Readonly<Model>;
    }

    // 拡張プロパティを生成
    const extensionProps = extension(frozenParams);

    // getterを持つプロパティをマージしてモデルを作成
    const model = createImmutableObject<Model>(frozenParams, extensionProps);

    return Object.freeze(model);
  };
};
