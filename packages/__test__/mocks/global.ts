import { vi } from 'vitest';
import { INITIAL_VIDEO_EL_HEIGHT, INITIAL_VIDEO_EL_WIDTH } from '../../Media/constants';

import { AudioContextMock } from './media';

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
  AudioContext: vi.fn().mockImplementation(() => AudioContextMock),
  webkitAudioContext: vi.fn().mockImplementation(() => AudioContextMock),
  innerWidth: 1024,
  innerHeight: 768,
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
    ELEMENT_NODE: 1,
  }),
} as unknown as Document

export const analyzerMock = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  getByteTimeDomainData: vi.fn(),
  getByteFrequencyData: vi.fn(),
  getFloatTimeDomainData: vi.fn(),
  getFloatFrequencyData: vi.fn(),
  frequencyBinCount: 1024,
  fftSize: 2048,
  smoothingTimeConstant: 0.8,
} as unknown as AnalyserNode;
