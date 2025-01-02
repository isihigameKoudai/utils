import { vi } from 'vitest';
import { INITIAL_VIDEO_EL_HEIGHT, INITIAL_VIDEO_EL_WIDTH } from '../../Media/constants';

export const streamMock = {
  getVideoTracks: vi.fn().mockReturnValue([
    { enabled: true, stop: vi.fn() }
  ]),
  getAudioTracks: vi.fn().mockReturnValue([
    { enabled: true, stop: vi.fn() }
  ])
};

export const navigatorMock = {
  mediaDevices: {
    getUserMedia: vi.fn().mockResolvedValue(streamMock)
  }
} as unknown as Navigator;

export const windowMock = {
  requestAnimationFrame: vi.fn().mockReturnValue(1),
  cancelAnimationFrame: vi.fn().mockReturnValue(1),
} as unknown as Window & typeof globalThis;

export const documentMock = {
  createElement: vi.fn().mockReturnValue({
    muted: false,
    autoplay: false,
    width: INITIAL_VIDEO_EL_WIDTH,
    height: INITIAL_VIDEO_EL_HEIGHT,
    srcObject: null,
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn().mockResolvedValue(undefined),
    // HTMLVideoElementとして認識されるために必要なプロパティを追加
    tagName: 'VIDEO',
    nodeName: 'VIDEO',
    nodeType: 1,
    ELEMENT_NODE: 1
  }),
} as unknown as Document
