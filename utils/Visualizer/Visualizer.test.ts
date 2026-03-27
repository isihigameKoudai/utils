import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  analyzerMock,
  navigatorMock,
  windowMock,
  documentMock,
} from '../__test__/mocks/global';
import { AudioContextMock } from '../__test__/mocks/media';

import type { RenderCallBack } from './type';
import { Visualizer } from './Visualizer';

describe('Visualizer', () => {
  let visualizer: Visualizer;

  let mockAnalyser: AnalyserNode;

  beforeEach(() => {
    mockAnalyser = analyzerMock;

    global.AudioContext = AudioContextMock as unknown as typeof AudioContext;

    visualizer = new Visualizer({
      navigator: navigatorMock,
      window: windowMock,
    });

    // stopメソッドをモックする
    visualizer.stop = vi.fn().mockImplementation(() => {
      if (visualizer.analyzer) {
        visualizer.analyzer.disconnect();
      }
      if (visualizer.requestAnimationFrameId) {
        windowMock.cancelAnimationFrame(visualizer.requestAnimationFrameId);
      }
    });

    // renderメソッドをモックする
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (visualizer as any).render = vi
      .fn()
      .mockImplementation((renderCallback) => {
        mockAnalyser.getByteTimeDomainData(visualizer.timeDomainArray);
        mockAnalyser.getByteFrequencyData(visualizer.spectrumArray);
        mockAnalyser.getFloatTimeDomainData(visualizer.timeDomainRawArray);
        mockAnalyser.getFloatFrequencyData(visualizer.spectrumRawArray);

        renderCallback({
          $canvas: visualizer.$canvas!,
          frequencyBinCount: mockAnalyser.frequencyBinCount,
          timeDomainArray: visualizer.timeDomainArray,
          spectrumArray: visualizer.spectrumArray,
          timeDomainRawArray: visualizer.timeDomainRawArray,
          spectrumRawArray: visualizer.spectrumRawArray,
        });

        // requestAnimationFrameを呼び出す
        const visualizerWithRender = visualizer as unknown as {
          render: (callback: RenderCallBack) => void;
        };
        windowMock.requestAnimationFrame(
          visualizerWithRender.render.bind(visualizer, renderCallback),
        );
      });

    // Audio.playメソッドのモックを追加
    const mockAudioPlay = vi.fn();
    visualizer.play = mockAudioPlay; // 直接プロパティとして設定

    // startメソッドをモックする
    visualizer.start = vi.fn().mockImplementation((renderCallback, options) => {
      mockAudioPlay(); // super.play() の呼び出しをシミュレート
      visualizer.analyzer = mockAnalyser;
      visualizer.$canvas = options.$canvas;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (visualizer as any).render(renderCallback); // renderメソッドを直接呼び出す
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).AudioContext;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).webkitAudioContext;
  });

  it('正しく初期化されること', () => {
    expect(visualizer.analyzer).toBeNull();
    expect(visualizer.timeDomainArray).toBeInstanceOf(Uint8Array);
    expect(visualizer.spectrumArray).toBeInstanceOf(Uint8Array);
    expect(visualizer.timeDomainRawArray).toBeInstanceOf(Float32Array);
    expect(visualizer.spectrumRawArray).toBeInstanceOf(Float32Array);
    expect(visualizer.$canvas).toBeNull();
    expect(visualizer.requestAnimationFrameId).toBe(0);
  });

  it('ビジュアライゼーションを開始すること', () => {
    const mockCanvas = documentMock.createElement('canvas');
    const mockRenderCallback: RenderCallBack = vi.fn();

    // Audio.playメソッドのモックを追加
    const mockAudioPlay = vi.fn();
    visualizer.play = mockAudioPlay; // 直接プロパティとして設定

    // startメソッドを直接呼び出す
    visualizer.start(mockRenderCallback, { $canvas: mockCanvas });

    expect(visualizer.analyzer).toBe(mockAnalyser);
    expect(visualizer.$canvas).toBe(mockCanvas);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((visualizer as any).render).toHaveBeenCalledWith(mockRenderCallback);
  });

  it('ビジュアライゼーションを停止すること', () => {
    const mockCancelAnimationFrame = vi.spyOn(
      windowMock,
      'cancelAnimationFrame',
    );

    visualizer.requestAnimationFrameId = 123;
    visualizer.analyzer = mockAnalyser;

    visualizer.stop();

    expect(visualizer.stop).toHaveBeenCalled();
    expect(mockAnalyser.disconnect).toHaveBeenCalled();
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it('ビジュアライゼーションをレンダリングすること', () => {
    const mockCanvas = documentMock.createElement('canvas');
    const mockRenderCallback: RenderCallBack = vi.fn();
    visualizer.analyzer = mockAnalyser;
    visualizer.$canvas = mockCanvas;

    // window.requestAnimationFrameのモックを追加
    const mockRequestAnimationFrame = vi.fn();
    vi.spyOn(windowMock, 'requestAnimationFrame').mockImplementation(
      mockRequestAnimationFrame,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (visualizer as any).render(mockRenderCallback);

    expect(mockAnalyser.getByteTimeDomainData).toHaveBeenCalled();
    expect(mockAnalyser.getByteFrequencyData).toHaveBeenCalled();
    expect(mockAnalyser.getFloatTimeDomainData).toHaveBeenCalled();
    expect(mockAnalyser.getFloatFrequencyData).toHaveBeenCalled();
    expect(mockRenderCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        $canvas: mockCanvas,
        frequencyBinCount: 1024,
        timeDomainArray: expect.any(Uint8Array),
        spectrumArray: expect.any(Uint8Array),
        timeDomainRawArray: expect.any(Float32Array),
        spectrumRawArray: expect.any(Float32Array),
      }),
    );
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });
});
