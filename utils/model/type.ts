import { ZodType } from 'zod';

/**
 * TModel から TParams のキーを除外した型（拡張プロパティ）
 */
export type Extension<
  Params extends Record<string, unknown>,
  Model extends Params,
> = Omit<Model, keyof Params>;

/**
 * モデルの拡張定義を生成する関数の型
 * @template Params - パラメータの型
 * @template Model - 完成したモデルの型
 */
export type ExtensionFactory<
  Params extends Record<string, unknown>,
  Model extends Params,
> = (params: Readonly<Params>) => Extension<Params, Model>;

/**
 * モデルファクトリの設定型
 * @template Params - パラメータの型（Zodスキーマから推論）
 * @template Model - 最終的なモデルの型
 */
export interface Config<
  Params extends Record<string, unknown>,
  Model extends Params = Params,
> {
  /** Zodスキーマによるパラメータ検証 */
  readonly schema: ZodType<Params>;
  /** 拡張プロパティを生成するファクトリ関数（Model が Params と異なる場合は必須） */
  readonly extension?: ExtensionFactory<Params, Model>;
}
