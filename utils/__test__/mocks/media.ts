import { vi } from 'vitest';

export class AudioContextMock {
  mockAnalyser: AnalyserNode;
  destination: AudioDestinationNode;

  decodeAudioData = vi.fn();
  suspend = vi.fn().mockResolvedValue(undefined);
  resume = vi.fn().mockResolvedValue(undefined);

  constructor(mockAnalyser: AnalyserNode) {
    this.mockAnalyser = mockAnalyser;
    this.destination = {} as AudioDestinationNode;
  }

  createAnalyser() {
    return this.mockAnalyser;
  }

  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(), // stopメソッドを明示的にモック
      disconnect: vi.fn(),
    };
  }

  createMediaStreamSource() {
    return vi.fn() as unknown as MediaStreamAudioSourceNode;
    // return {
    //   connect: vi.fn(),
    //   disconnect: vi.fn(),
    // };
  }
}

export const mediaSourceMock = {
  disconnect: vi.fn(),
} as unknown as MediaStreamAudioSourceNode;

export const audioSourceMock = {
  disconnect: vi.fn(),
  stop: vi.fn(),
} as unknown as AudioBufferSourceNode;
