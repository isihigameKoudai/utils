import { ChromaClient, IncludeEnum } from 'chromadb';
import type { Collection, Metadata, Where } from 'chromadb';

export type { Collection };

type ChromaSpace = 'cosine' | 'l2' | 'ip';

type ChromaConfig = {
  host?: string;
  port?: number;
  ssl?: boolean;
  headers?: Record<string, string>;
};

export type AddDocumentArgs = {
  id: string;
  embedding: number[];
  document?: string;
  metadata?: Metadata;
};

export type QueryDocumentResult = {
  id: string;
  /** cosine 空間では 1 - cosine_similarity（小さいほど類似） */
  distance: number;
  document: string | null;
  metadata: Metadata | null;
};

/**
 * ChromaDB クライアントを初期化し、コレクション操作のユーティリティを返す。
 * 事前計算済みの embeddingの保存・検索に特化。
 *
 * @example
 * ```typescript
 * const chroma = defineChroma({ host: 'localhost', port: 8000 });
 * const collection = await chroma.getOrCreateCollection('my-vectors');
 * await chroma.addDocuments(collection, [
 *   { id: 'doc-1', embedding: [0.1, 0.2, ...], document: 'Hello', metadata: { type: 'text' } },
 * ]);
 * const results = await chroma.queryDocuments(collection, [0.1, 0.2, ...], 5);
 * ```
 */
export const defineChroma = (config?: ChromaConfig) => {
  /**
   * https://docs.trychroma.com/docs/overview/introduction
   */
  const client = new ChromaClient({
    host: config?.host ?? 'localhost',
    port: config?.port ?? 8000,
    ssl: config?.ssl ?? false,
    headers: config?.headers,
  });

  /**
   * ChromaDBサーバーの死活監視（ハートビート）を行う
   * @returns サーバーが正常に応答すれば true、それ以外は false
   */
  const heartbeat = async (): Promise<boolean> => {
    try {
      await client.heartbeat();
      return true;
    } catch {
      return false;
    }
  };

  /**
   * サーバーの死活監視を行う（接続確認）
   * @throws サーバーに接続できない場合
   */
  const connect = async (): Promise<void> => {
    const isAlive = await heartbeat();
    if (!isAlive) throw new Error('ChromaDB server is not responding');
  };

  /**
   * コレクションを取得、存在しない場合は作成する
   * @param name コレクション名
   * @param space 距離計算のアルゴリズム (デフォルト: 'cosine')
   * @returns Collectionインスタンス
   */
  const getOrCreateCollection = (
    name: string,
    space: ChromaSpace = 'cosine',
  ): Promise<Collection> =>
    client.getOrCreateCollection({
      name,
      // 事前計算した embedding を使うため、Chroma 側の自動 embedding は無効化
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      embeddingFunction: null as any,
      metadata: { 'hnsw:space': space },
    });

  /**
   * 既存のコレクションを取得する
   * @param name コレクション名
   * @returns Collectionインスタンス
   * @throws コレクションが存在しない場合
   */
  const getCollection = (name: string): Promise<Collection> =>
    client.getCollection({
      name,
      // 事前計算した embedding を使うため、Chroma 側の自動 embedding は無効化
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      embeddingFunction: null as any,
    });

  /**
   * コレクションにドキュメント（Embeddingとメタデータ）を追加・更新する
   * @param collection 追加先のCollectionインスタンス
   * @param documents 追加するドキュメントの配列
   */
  const addDocuments = async (
    collection: Collection,
    documents: AddDocumentArgs[],
  ): Promise<void> => {
    await collection.upsert({
      ids: documents.map((d) => d.id),
      embeddings: documents.map((d) => d.embedding),
      documents: documents.map((d) => d.document ?? d.id),
      metadatas: documents.map((d) => d.metadata ?? {}),
    });
  };

  /**
   * クエリベクトルに類似するドキュメントを検索する
   * @param collection 検索対象のCollectionインスタンス
   * @param queryEmbedding 検索の基準となるベクトル
   * @param nResults 取得する上位の件数 (デフォルト: 10)
   * @param where メタデータによるフィルタリング条件
   * @returns 検索結果の配列
   */
  const getDocuments = async (
    collection: Collection,
    queryEmbedding: number[],
    nResults: number = 10,
    where?: Where,
  ): Promise<QueryDocumentResult[]> => {
    const include = [
      IncludeEnum.metadatas,
      IncludeEnum.documents,
      IncludeEnum.distances,
    ];
    const result = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults,
      where,
      include,
    });

    const rows = result.rows();
    if (rows.length === 0) return [];

    return rows[0].map((row) => ({
      id: row.id,
      distance: row.distance ?? 0,
      document: row.document ?? null,
      metadata: row.metadata ?? null,
    }));
  };

  /**
   * コレクション内の全ドキュメントを取得する
   * @param collection 取得対象のCollectionインスタンス
   * @returns コレクション内の全ドキュメント
   */
  const getAllDocuments = async (
    collection: Collection,
  ): Promise<QueryDocumentResult[]> => {
    const result = await collection.get({
      include: [IncludeEnum.metadatas, IncludeEnum.documents],
    });

    const rows = result.rows();
    return rows.map((row) => ({
      id: row.id,
      distance: 0,
      document: row.document ?? null,
      metadata: row.metadata ?? null,
    }));
  };

  /**
   * コレクションから指定したIDのドキュメントを削除する
   * @param collection 削除対象のCollectionインスタンス
   * @param ids 削除するドキュメントのID配列
   */
  const deleteDocuments = async (
    collection: Collection,
    ids: string[],
  ): Promise<void> => {
    await collection.delete({ ids });
  };

  return {
    connect,
    getCollection,
    getOrCreateCollection,
    addDocuments,
    getDocuments,
    getAllDocuments,
    deleteDocuments,
    heartbeat,
  };
};

/**
 * URL文字列からChromaDBの接続設定をパースし、ユーティリティを初期化する
 * @param url ChromaDBサーバーのURL (例: 'http://localhost:8000')
 * @returns defineChromaの返り値と同じユーティリティ群
 */
export const defineChromaFromUrl = (url: string) => {
  const parsed = new URL(url);
  return defineChroma({
    host: parsed.hostname,
    port: parsed.port
      ? Number(parsed.port)
      : parsed.protocol === 'https:'
        ? 443
        : 8000,
    ssl: parsed.protocol === 'https:',
  });
};
