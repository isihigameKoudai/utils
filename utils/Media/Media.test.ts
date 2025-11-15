import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Media } from './Media';

describe('Media', () => {
  let media: Media;

  beforeEach(() => {
    media = new Media();
  });

  test('初期化時にstreamがnullであること', () => {
    expect(media.stream).toBeNull();
  });

  test('getUserMediaが正常に動作すること', async () => {
    const mockStream = {} as MediaStream;
    const mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: mockGetUserMedia,
      },
    });

    const constraints: MediaStreamConstraints = { audio: true, video: true };
    const result = await media.getUserMedia(constraints);

    expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    expect(result).toBe(mockStream);
    expect(media.stream).toBe(mockStream);
  });

  test('getUserMediaがエラーをキャッチすること', async () => {
    const mockError = new Error('getUserMedia error');
    const mockGetUserMedia = vi.fn().mockRejectedValue(mockError);

    vi.stubGlobal('navigator', {
      mediaDevices: {
        getUserMedia: mockGetUserMedia,
      },
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const constraints: MediaStreamConstraints = { audio: true, video: true };

    await expect(media.getUserMedia(constraints)).rejects.toThrow(
      'getUserMedia error',
    );

    expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    expect(media.stream).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    consoleErrorSpy.mockRestore();
  });
});
