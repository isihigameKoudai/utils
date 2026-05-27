import type { InferOutput } from 'valibot';

import type { embeddingResultSchema } from './scheme';

/**
 * Raw params type (Store/API用)
 * @description StoreやAPIで使用する生データ型
 */
export type EmbeddingResultParams = InferOutput<typeof embeddingResultSchema>;

/**
 * EmbeddingResult Model type
 * @description EmbeddingResultParams + computed properties + methods
 */
export type EmbeddingResult = EmbeddingResultParams & {
  /** @description 表示用の次元数 */
  readonly dimensionsLabel: string;
  /** @description 表示用の実行時間 */
  readonly executionTimeLabel: string;
  /** @description ベクトルのL2ノルム */
  readonly vectorNorm: number;
  /** @description プレビュー用の値（最初の100個） */
  readonly previewValues: number[];
  /** @description プレビュー用の文字列 */
  readonly previewString: string;
};
