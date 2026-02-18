import { describe, test, expect, beforeEach, vi } from 'vitest';

import { Media } from './Media';

describe('Media', () => {
  let media: Media;
  const mockGetUserMedia = vi.fn();

  const navigatorMock = {
    mediaDevices: {
      getUserMedia: mockGetUserMedia,
    },
  } as unknown as Navigator;

  beforeEach(() => {
    mockGetUserMedia.mockReset();
    media = new Media({ navigator: navigatorMock });
  });

  test('初期化時にstreamがnullであること', () => {
    expect(media.stream).toBeNull();
  });

  test('getUserMediaが正常に動作すること', async () => {
    const mockStream = {} as MediaStream;
    mockGetUserMedia.mockResolvedValue(mockStream);

    const constraints: MediaStreamConstraints = { audio: true, video: true };
    const result = await media.getUserMedia(constraints);

    expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    expect(result).toBe(mockStream);
    expect(media.stream).toBe(mockStream);
  });

  test('getUserMediaがエラーをキャッチすること', async () => {
    const mockError = new Error('getUserMedia error');
    mockGetUserMedia.mockRejectedValue(mockError);

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
