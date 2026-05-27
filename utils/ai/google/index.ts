/**
 * pnpm install @google/genai
 */
import {
  FileState,
  GoogleGenAI,
  type GoogleGenAIOptions,
  type EmbedContentConfig,
  type GenerateContentConfig,
  type ContentListUnion,
  type Content,
} from '@google/genai';

interface DefineConfig {
  root: GoogleGenAIOptions;
  embedding?: EmbedContentConfig;
  generation?: GenerateContentConfig;
}

/**
 * 100MB limit for inline data
 */
const INLINE_SIZE_LIMIT = 100 * 1024 * 1024; // 100MB
/**
 * 2GB limit for file API
 */
const FILE_SIZE_LIMIT = 2 * 1024 * 1024 * 1024; // 2GB

const MODELS = {
  GEMINI_EMBEDDING_2: 'gemini-embedding-2',
  GEMINI_3_FLASH_PREVIEW: 'gemini-3-flash-preview',
} as const;

export const defineGemini = (config: DefineConfig) => {
  const ai = new GoogleGenAI(config.root);

  /**
   * @description
   * Google Gemini Embeddings APIを呼び出す関数
   * @param content embeddingを実行したいContentListUnionオブジェクト
   * @returns
   * @example
   * ```typescript
   * const response = await embed({
   *   contents: "Hello, world!",
   * });
   * ```
   */
  const embed = (content: ContentListUnion) => {
    if (!config.embedding) {
      throw new Error('config.embedding is required');
    }
    return ai.models.embedContent({
      ...config.embedding,
      model: MODELS.GEMINI_EMBEDDING_2,
      contents: content,
    });
  };

  /**
   * 100MB以上のファイルをembeddingする関数
   *
   * @param file embeddingしたいファイル
   * @returns embedding結果
   * @throws Error: ファイルサイズが100MBを超える場合
   *
   * @example
   * ```typescript
   * const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
   * const response = await embedInlineFile(file);
   * ```
   */
  const embedInlineFile = async (file: File, text?: string) => {
    if (INLINE_SIZE_LIMIT < file.size) {
      throw new Error(
        `File size must be less than ${INLINE_SIZE_LIMIT / (1024 * 1024)} MB`,
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );

    const parts: Content['parts'] = [];
    if (text) {
      parts.push({ text });
    }
    parts.push({
      inlineData: {
        mimeType: file.type,
        data: base64,
      },
    });

    return embed({ parts });
  };

  /**
   * 2GB未満のファイルをFile APIでembeddingする関数
   * @param file embeddingしたいファイル
   * @param text 追加のテキスト（オプション）
   * @returns embedding結果
   * @throws Error: ファイルサイズが2GBを超える場合
   *
   * @example
   * ```typescript
   * const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
   * const response = await embedLargeFile(file, "これはテストです");
   * ```
   */
  const embedLargeFile = async (file: File, text?: string) => {
    if (FILE_SIZE_LIMIT < file.size) {
      throw new Error('File size is too large for embedding');
    }

    const uploaded = await ai.files.upload({
      file: new Blob([await file.arrayBuffer()], { type: file.type }),
      config: { mimeType: file.type },
    });

    // Wait for processing
    let status = await ai.files.get({ name: uploaded.name! });
    while (status.state === FileState.PROCESSING) {
      await new Promise((r) => setTimeout(r, 2000));
      status = await ai.files.get({ name: uploaded.name! });
    }

    if (status.state === FileState.FAILED) {
      throw new Error('File processing failed');
    }

    const parts: Content['parts'] = [
      {
        fileData: {
          mimeType: status.mimeType!,
          fileUri: status.uri!,
        },
      },
    ];
    if (text) {
      parts.push({ text });
    }

    const response = await embed([{ parts }]);

    // Clean up uploaded file
    await ai.files.delete({ name: uploaded.name! });

    return response;
  };

  /**
   * ファイルが100MB未満の場合：embedInlineFile
   * ファイルが100MB以上の場合：embedLargeFile
   * ファイルが2GB以上の場合：error
   */
  const embedFile = (file: File, text?: string) => {
    if (file.size < INLINE_SIZE_LIMIT) {
      return embedInlineFile(file, text);
    }
    return embedLargeFile(file, text);
  };

  /**
   * Google Gemini Generate Content APIを呼び出す関数
   */
  const generate = (content: ContentListUnion) => {
    return ai.models.generateContent({
      ...config.generation,
      model: MODELS.GEMINI_3_FLASH_PREVIEW,
      contents: content,
    });
  };

  const generateInlineFile = async (file: File, text: string) => {
    if (INLINE_SIZE_LIMIT < file.size) {
      throw new Error(
        `File size must be less than ${INLINE_SIZE_LIMIT / (1024 * 1024)} MB`,
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        '',
      ),
    );

    const parts: Content['parts'] = [];
    if (text) {
      parts.push({ text });
    }
    parts.push({
      inlineData: {
        mimeType: file.type,
        data: base64,
      },
    });

    return generate({ parts });
  };

  const generateLargeFile = async (file: File, text: string) => {
    if (FILE_SIZE_LIMIT < file.size) {
      throw new Error('File size is too large for generation');
    }

    const uploaded = await ai.files.upload({
      file: new Blob([await file.arrayBuffer()], { type: file.type }),
      config: { mimeType: file.type },
    });

    let status = await ai.files.get({ name: uploaded.name! });
    while (status.state === FileState.PROCESSING) {
      await new Promise((r) => setTimeout(r, 2000));
      status = await ai.files.get({ name: uploaded.name! });
    }

    if (status.state === FileState.FAILED) {
      throw new Error('File processing failed');
    }

    const parts: Content['parts'] = [];
    if (text) {
      parts.push({ text });
    }
    parts.push({
      fileData: {
        mimeType: status.mimeType!,
        fileUri: status.uri!,
      },
    });

    const response = await generate([{ parts }]);

    await ai.files.delete({ name: uploaded.name! });

    return response;
  };

  const generateFile = (file: File, text: string) => {
    if (file.size < INLINE_SIZE_LIMIT) {
      return generateInlineFile(file, text);
    }
    return generateLargeFile(file, text);
  };

  return {
    embed,
    embedFile,
    generateFile,
  };
};
