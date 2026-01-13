import { describe, test, expect, beforeEach, vi } from 'vitest';

import { Video } from './Video';

describe('Video', () => {
  let video: Video;

  beforeEach(() => {
    video = new Video();
  });

  test('初期化時にmagnificationが{x: 1, y: 1}であること', () => {
    expect(video.magnification).toEqual({ x: 1, y: 1 });
  });

  test('初期化時に$videoがnullであること', () => {
    expect(video.$video).toBeNull();
  });

  test('setMagnificationが正常に動作すること', () => {
    video.setMagnification({ x: 2, y: 3 });
    expect(video.magnification).toEqual({ x: 2, y: 3 });
  });

  test('getVideoStreamが正常に動作すること', async () => {
    const mockStream = {} as MediaStream;
    const mockGetUserMedia = vi.fn().mockResolvedValue(mockStream);

    vi.spyOn(video, 'getUserMedia').mockImplementation(mockGetUserMedia);

    const result = await video.getVideoStream();

    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
    expect(result).toBe(mockStream);
  });

  test('setVideoが正常に動作すること', () => {
    const mockStream = {} as MediaStream;
    const mockVideo = { srcObject: null } as HTMLVideoElement;

    video['_stream'] = mockStream;
    video.setVideo(mockVideo);

    expect(mockVideo.srcObject).toBe(mockStream);
    expect(video.$video).toBe(mockVideo);
  });

  test('setVideoがstreamがない場合にエラーをログ出力すること', () => {
    const mockVideo = {} as HTMLVideoElement;
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    video.setVideo(mockVideo);

    expect(consoleErrorSpy).toHaveBeenCalledWith('stream is not loaded');
    expect(video.$video).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
