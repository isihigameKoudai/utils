import { ObjectDetector } from '@mediapipe/tasks-vision';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  documentMock,
  navigatorMock,
  streamMock,
  windowMock,
} from '../../__test__/mocks/global';
import {
  INITIAL_VIDEO_EL_HEIGHT,
  INITIAL_VIDEO_EL_WIDTH,
} from '../../Media/constants';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import { VisualDetection } from './VisualDetection';

vi.mock('../vision', () => ({
  getVisionFileset: vi.fn().mockResolvedValue({}),
}));

vi.mock('@mediapipe/tasks-vision', () => ({
  ObjectDetector: {
    createFromOptions: vi.fn(),
  },
}));

describe('VisualDetection', () => {
  let visualDetector: VisualDetection;

  const mockDetections = [
    {
      boundingBox: {
        originX: 100,
        originY: 200,
        width: 50,
        height: 60,
        angle: 0,
      },
      categories: [
        {
          categoryName: 'person',
          score: 0.95,
          index: 0,
          displayName: '',
        },
      ],
      keypoints: [],
    },
  ];

  beforeEach(() => {
    vi.mocked(ObjectDetector.createFromOptions).mockResolvedValue({
      setOptions: vi.fn(),
      detect: vi.fn(),
      detectForVideo: vi.fn().mockReturnValue({ detections: mockDetections }),
      close: vi.fn(),
    });

    visualDetector = new VisualDetection({
      navigator: navigatorMock,
      document: documentMock,
      window: windowMock,
    });
  });

  describe('loadModel', () => {
    it('モデルが正しくロードされること', async () => {
      const model = await visualDetector.loadModel();

      expect(getVisionFileset).toHaveBeenCalled();
      expect(ObjectDetector.createFromOptions).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          baseOptions: expect.objectContaining({
            modelAssetPath: MODEL_ASSET_PATH,
            delegate: 'GPU',
          }),
          runningMode: 'VIDEO',
          scoreThreshold: 0.3,
        }),
      );
      expect(model).not.toBeNull();
    });

    it('モデルのロードに失敗した場合エラーをスローすること', async () => {
      const error = new Error('Model load failed');
      vi.mocked(ObjectDetector.createFromOptions).mockRejectedValueOnce(error);

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
      expect(video.srcObject).toBe(streamMock);
    });

    it('カスタムサイズでビデオ要素が正しく初期化されること', async () => {
      const customWidth = 1280;
      const customHeight = 720;

      const video = await visualDetector.loadEl({
        width: customWidth,
        height: customHeight,
      });

      expect(video.width).toBe(customWidth);
      expect(video.height).toBe(customHeight);
      expect(visualDetector.magnification.x).toBe(
        customWidth / INITIAL_VIDEO_EL_WIDTH,
      );
      expect(visualDetector.magnification.y).toBe(
        customHeight / INITIAL_VIDEO_EL_HEIGHT,
      );
    });
  });

  describe('detectedObjects', () => {
    it('検出されたオブジェクトが正しく変換されること', async () => {
      await visualDetector.loadModel();
      await visualDetector.loadEl({});
      visualDetector._detectedRawObjects = mockDetections;

      const detectedObjects = visualDetector.detectedObjects;
      const detectedObject = detectedObjects[0];

      expect(detectedObject.left).toBe(mockDetections[0].boundingBox.originX);
      expect(detectedObject.top).toBe(mockDetections[0].boundingBox.originY);
      expect(detectedObject.width).toBe(mockDetections[0].boundingBox.width);
      expect(detectedObject.height).toBe(mockDetections[0].boundingBox.height);
      expect(detectedObject.class).toBe(
        mockDetections[0].categories[0].categoryName,
      );
      expect(detectedObject.score).toBe(mockDetections[0].categories[0].score);
    });
  });

  describe('start/stop', () => {
    it('検出処理が正しく開始されること', async () => {
      await visualDetector.loadModel();
      await visualDetector.loadEl({});

      const mockCallback = vi.fn();
      await visualDetector.start(mockCallback);

      expect(mockCallback).toHaveBeenCalled();
    });

    it('stopが正しく実行されること', async () => {
      await visualDetector.loadEl({});
      visualDetector.stop();

      const videoTracks = streamMock.getVideoTracks()[0];
      const audioTracks = streamMock.getAudioTracks()[0];

      expect(videoTracks.stop).toHaveBeenCalled();
      expect(audioTracks.stop).toHaveBeenCalled();
      expect(visualDetector.stream).toBeNull();
      expect(visualDetector.$video).toBeNull();
    });
  });
});
