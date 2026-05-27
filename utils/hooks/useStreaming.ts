import { useCallback, useRef, useState, useTransition } from 'react';

import { streaming, type StreamOptions } from '@/utils/api/streaming';

type UseStreamingOptions = Pick<
  StreamOptions,
  'onRecieve' | 'onComplete' | 'onError' | 'decodeText'
>;

/**
 * Streaming fetchを行うためのReact Hook
 * @param input リクエストURL
 */
export function useStreaming(input: RequestInfo | URL) {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const controllerRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (init?: RequestInit, options?: UseStreamingOptions) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setText('');
      setIsStreaming(true);

      try {
        await streaming(input, init, {
          ...options,
          signal: controller.signal,
          onRecieve: (chunk) => {
            startTransition(() => {
              if (typeof chunk === 'string') {
                setText((prev) => prev + chunk);
              }
            });
            options?.onRecieve?.(chunk);
          },
          onComplete: () => {
            setIsStreaming(false);
            options?.onComplete?.();
          },
          onError: (e) => {
            setIsStreaming(false);
            options?.onError?.(e);
          },
        });
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          console.error(e);
          options?.onError?.(e as Error);
        }
        setIsStreaming(false);
      }
    },
    [input],
  );

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { text, isStreaming, isPending, start, stop };
}
