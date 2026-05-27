export type StreamOptions = {
  /** 各チャンクを受け取るコールバック */
  onRecieve?: (chunk: string | Uint8Array) => void | Promise<void>;
  /** ストリーミング完了時のコールバック */
  onComplete?: () => void | Promise<void>;
  /** エラー発生時のコールバック */
  onError?: (error: Error) => void | Promise<void>;
  /** テキストとして扱うかどうか（デフォルト: true） */
  decodeText?: boolean;
  /** AbortSignal（ユーザーキャンセルなどに使用） */
  signal?: AbortSignal;
};

export type StreamResult = {
  /** レスポンス全体の情報 */
  response: Response;
};

/**
 * fetch + Streaming ユーティリティ（getReaderベース）
 */
export async function streaming(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: StreamOptions = {},
): Promise<StreamResult> {
  const { onRecieve, onComplete, onError, decodeText = true, signal } = options;

  const response = await fetch(input, {
    ...init,
    signal,
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    void onError?.(error);
    throw error;
  }

  if (!response.body) {
    const error = new Error('Response body is null');
    void onError?.(error);
    throw error;
  }

  const reader = response.body.getReader();

  // メイン処理
  void (async () => {
    const decoder = decodeText ? new TextDecoder() : null;
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // 最後のバッファがあれば処理
          if (buffer && decodeText) {
            void onRecieve?.(buffer);
          }
          await onComplete?.();
          break;
        }

        let chunk: Uint8Array | string = value;

        if (decodeText && decoder) {
          const decoded = decoder.decode(value, { stream: true });
          buffer += decoded;

          // 必要に応じてここで改行やイベントごとに分割も可能
          chunk = decoded;
        }

        if (onRecieve) {
          await onRecieve(chunk);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Stream was cancelled');
      } else {
        console.error('Stream error:', err);
        await onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      reader.releaseLock();
    }
  })();

  return { response };
}
