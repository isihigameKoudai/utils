import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { VisualDetector } from './VisualDetector';
import { INITIAL_VIDEO_EL_WIDTH, INITIAL_VIDEO_EL_HEIGHT } from '../constants';

describe('VisualDetector', () => {
  let visualDetector: VisualDetector;
  
  const mockDetectedObjects: cocoSsd.DetectedObject[] = [
    {
      bbox: [100, 200, 50, 60], // [x, y, width, height]
      class: 'person',
      score: 0.95
    }
  ];

  const mockModel = {
    detect: vi.fn(),
    modelPath: '',
    model: {},
    getPrefix: () => '',
    load: vi.fn(),
    infer: vi.fn(),
    buildDetectedObjects: vi.fn(),
    calculateMaxScores: vi.fn(),
    dispose: vi.fn()
  } as unknown as cocoSsd.ObjectDetection;

  const mockStream = {
    getVideoTracks: vi.fn().mockReturnValue([
      { enabled: true, stop: vi.fn() }
    ]),
    getAudioTracks: vi.fn().mockReturnValue([
      { enabled: true, stop: vi.fn() }
    ])
  };

  beforeEach(() => {
    // ブラウザAPIのモック
    global.navigator = {
      mediaDevices: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream)
      }
    } as unknown as Navigator;

    global.document = {
      createElement: vi.fn().mockReturnValue({
        muted: false,
        autoplay: false,
        width: INITIAL_VIDEO_EL_WIDTH,
        height: INITIAL_VIDEO_EL_HEIGHT,
        srcObject: null,
        play: vi.fn().mockResolvedValue(undefined),
        // HTMLVideoElementとして認識されるために必要なプロパティを追加
        tagName: 'VIDEO',
        nodeName: 'VIDEO',
        nodeType: 1,
        ELEMENT_NODE: 1
      }),
    } as unknown as Document;

    // cocoSsd.loadのモックを修正
    vi.spyOn(cocoSsd, 'load').mockResolvedValue(mockModel);

    // windowオブジェクトのモックを追加
    global.window = {
      requestAnimationFrame: vi.fn().mockReturnValue(1),
    } as unknown as Window & typeof globalThis;

    visualDetector = new VisualDetector();
  });

  describe('loadModel', () => {
    it('モデルが正しくロードされること', async () => {
      const model = await visualDetector.loadModel();
      
      expect(cocoSsd.load).toHaveBeenCalled();
      expect(model).toBe(mockModel);
    });

    it('モデルのロードに失敗した場合エラーをスローすること', async () => {
      const error = new Error('Model load failed');
      vi.spyOn(cocoSsd, 'load').mockRejectedValueOnce(error);

      await expect(visualDetector.loadModel()).rejects.toThrow();
    });
  });

  describe('loadEl', () => {
    it('デフォルトの設定でビデオ要素が正しく初期化されること', async () => {
      const video = await visualDetector.loadEl({});
      
      expect(video.width).toBe(INITIAL_VIDEO_EL_WIDTH);
      expect(video.height).toBe(INITIAL_VIDEO_EL_HEIGHT);
      expect(video.muted).toBe(true);
      expect(video.autoplay).toBe(true);
      expect(video.srcObject).toBe(mockStream);
    });

    it('カスタムサイズでビデオ要素が正しく初期化されること', async () => {
      const customWidth = 1280;
      const customHeight = 720;
      
      const video = await visualDetector.loadEl({
        width: customWidth,
        height: customHeight
      });

      expect(video.width).toBe(customWidth);
      expect(video.height).toBe(customHeight);
      expect(visualDetector.magnification.x).toBe(customWidth / INITIAL_VIDEO_EL_WIDTH);
      expect(visualDetector.magnification.y).toBe(customHeight / INITIAL_VIDEO_EL_HEIGHT);
    });
  });

  describe('detectedObjects', () => {
    it('検出されたオブジェクトが正しく変換されること', async () => {
      await visualDetector.loadModel();
      await visualDetector.loadEl({});
      visualDetector._detectedRawObjects = mockDetectedObjects;

      const detectedObjects = visualDetector.detectedObjects;
      const obj = detectedObjects[0];

      expect(obj.left).toBe(mockDetectedObjects[0].bbox[0]);
      expect(obj.top).toBe(mockDetectedObjects[0].bbox[1]);
      expect(obj.width).toBe(mockDetectedObjects[0].bbox[2]);
      expect(obj.height).toBe(mockDetectedObjects[0].bbox[3]);
      expect(obj.class).toBe(mockDetectedObjects[0].class);
      expect(obj.score).toBe(mockDetectedObjects[0].score);
    });
  });

  describe('start/stop', () => {
    it('検出処理が正しく開始されること', async () => {
      await visualDetector.loadModel();
      await visualDetector.loadEl({});

      const mockCallback = vi.fn();
      await visualDetector.start(mockCallback);

      expect(mockModel.detect).toHaveBeenCalled();
      expect(mockCallback).toHaveBeenCalled();
    });

    it('stopが正しく実行されること', async () => {
      await visualDetector.loadEl({});
      visualDetector.stop();

      const videoTracks = mockStream.getVideoTracks()[0];
      const audioTracks = mockStream.getAudioTracks()[0];

      expect(videoTracks.stop).toHaveBeenCalled();
      expect(audioTracks.stop).toHaveBeenCalled();
      expect(visualDetector.stream).toBeNull();
      expect(visualDetector.$video).toBeNull();
    });
  });
});
