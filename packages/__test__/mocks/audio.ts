import { vi } from 'vitest';

export class AudioContextMock {
  mockAnalyser: AnalyserNode;

  constructor(mockAnalyser: AnalyserNode) {
    this.mockAnalyser = mockAnalyser;
  }

  createAnalyser() {
    return this.mockAnalyser;
  }

  createBufferSource() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
    };
  }

  createMediaStreamSource() {
    return {
      connect: vi.fn(),
    };
  }
}