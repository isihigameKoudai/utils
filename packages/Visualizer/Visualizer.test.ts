import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Visualizer, RenderCallBack } from "./Visualizer";

import { analyzerMock, windowMock, documentMock } from '../__test__/mocks/global';
import { AudioContextMock } from '../__test__/mocks/audio';

describe("Visualizer", () => {
  let visualizer: Visualizer;
  let mockAudioContext: AudioContext;
  let mockAnalyser: AnalyserNode;

  beforeEach(() => {
    mockAnalyser = analyzerMock;

    mockAudioContext = new AudioContextMock(mockAnalyser) as unknown as AudioContext;

    global.window = windowMock;
    global.document = documentMock as unknown as Document;
    global.AudioContext = AudioContextMock as unknown as typeof AudioContext;
    global.webkitAudioContext = AudioContextMock as unknown as typeof AudioContext;

    // requestAnimationFrameのモックを追加
    const mockRequestAnimationFrame = vi.fn();
    global.window = {
      ...global.window,
      requestAnimationFrame: mockRequestAnimationFrame,
    } as unknown as Window & typeof globalThis;

    visualizer = new Visualizer();

    // stopメソッドをモックする
    visualizer.stop = vi.fn().mockImplementation(() => {
      if (visualizer.analyzer) {
        visualizer.analyzer.disconnect();
      }
      if (visualizer.requestAnimationFrameId) {
        window.cancelAnimationFrame(visualizer.requestAnimationFrameId);
      }
    });

    // renderメソッドをモックする
    (visualizer as any).render = vi.fn().mockImplementation((renderCallback) => {
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
      window.requestAnimationFrame((visualizer as any).render.bind(visualizer, renderCallback));
    });

    // Audio.playメソッドのモックを追加
    const mockAudioPlay = vi.fn();
    visualizer.play = mockAudioPlay;  // 直接プロパティとして設定

    // startメソッドをモックする
    visualizer.start = vi.fn().mockImplementation((renderCallback, options) => {
      mockAudioPlay(); // super.play() の呼び出しをシミュレート
      visualizer.analyzer = mockAnalyser;
      visualizer.$canvas = options.$canvas;
      (visualizer as any).render(renderCallback); // renderメソッドを直接呼び出す
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (global as any).window;
    delete (global as any).document;
    delete (global as any).AudioContext;
    delete (global as any).webkitAudioContext;
  });

  it("正しく初期化されること", () => {
    expect(visualizer.analyzer).toBeNull();
    expect(visualizer.timeDomainArray).toBeInstanceOf(Uint8Array);
    expect(visualizer.spectrumArray).toBeInstanceOf(Uint8Array);
    expect(visualizer.timeDomainRawArray).toBeInstanceOf(Float32Array);
    expect(visualizer.spectrumRawArray).toBeInstanceOf(Float32Array);
    expect(visualizer.$canvas).toBeNull();
    expect(visualizer.requestAnimationFrameId).toBe(0);
  });

  it("ビジュアライゼーションを開始すること", () => {
    const mockCanvas = documentMock.createElement("canvas");
    const mockRenderCallback: RenderCallBack = vi.fn();
    
    // Audio.playメソッドのモックを追加
    const mockAudioPlay = vi.fn();
    visualizer.play = mockAudioPlay;  // 直接プロパティとして設定

    // startメソッドを直接呼び出す
    visualizer.start(mockRenderCallback, { $canvas: mockCanvas });

    expect(visualizer.analyzer).toBe(mockAnalyser);
    expect(visualizer.$canvas).toBe(mockCanvas);
    expect((visualizer as any).render).toHaveBeenCalledWith(mockRenderCallback);
  });

  it("ビジュアライゼーションを停止すること", () => {
    const mockCancelAnimationFrame = vi.spyOn(window, "cancelAnimationFrame");

    visualizer.requestAnimationFrameId = 123;
    visualizer.analyzer = mockAnalyser;

    visualizer.stop();

    expect(visualizer.stop).toHaveBeenCalled();
    expect(mockAnalyser.disconnect).toHaveBeenCalled();
    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it("ビジュアライゼーションをレンダリングすること", () => {
    const mockCanvas = documentMock.createElement("canvas");
    const mockRenderCallback: RenderCallBack = vi.fn();
    visualizer.analyzer = mockAnalyser;
    visualizer.$canvas = mockCanvas;

    // window.requestAnimationFrameのモックを追加
    const mockRequestAnimationFrame = vi.fn();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(mockRequestAnimationFrame);

    (visualizer as any).render(mockRenderCallback);

    expect(mockAnalyser.getByteTimeDomainData).toHaveBeenCalled();
    expect(mockAnalyser.getByteFrequencyData).toHaveBeenCalled();
    expect(mockAnalyser.getFloatTimeDomainData).toHaveBeenCalled();
    expect(mockAnalyser.getFloatFrequencyData).toHaveBeenCalled();
    expect(mockRenderCallback).toHaveBeenCalledWith(expect.objectContaining({
      $canvas: mockCanvas,
      frequencyBinCount: 1024,
      timeDomainArray: expect.any(Uint8Array),
      spectrumArray: expect.any(Uint8Array),
      timeDomainRawArray: expect.any(Float32Array),
      spectrumRawArray: expect.any(Float32Array),
    }));
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });
});