import { FaceDetector } from '@mediapipe/tasks-vision';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  documentMock,
  navigatorMock,
  windowMock,
} from '../../__test__/mocks/global';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import { FaceDetection } from './FaceDetection';

vi.mock('../vision', () => ({
  getVisionFileset: vi.fn().mockResolvedValue({}),
}));

vi.mock('@mediapipe/tasks-vision', () => ({
  FaceDetector: {
    createFromOptions: vi.fn(),
  },
}));

describe('FaceDetection', () => {
  let detector: FaceDetection;

  beforeEach(() => {
    vi.mocked(FaceDetector.createFromOptions).mockResolvedValue({
      setOptions: vi.fn(),
      detect: vi.fn(),
      detectForVideo: vi.fn().mockReturnValue({
        detections: [
          {
            boundingBox: {
              originX: 0,
              originY: 0,
              width: 100,
              height: 100,
              angle: 0,
            },
            keypoints: [
              { x: 0.5, y: 0.5 },
              { x: 0.3, y: 0.3 },
              { x: 0.7, y: 0.3 },
            ],
            categories: [],
          },
        ],
      }),
      close: vi.fn(),
    });

    detector = new FaceDetection({
      navigator: navigatorMock,
      document: documentMock,
      window: windowMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(detector.model).toBe('MediaPipeFaceDetector');
      expect(detector.detector).toBeNull();
      expect(detector.detectedRawFaces).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
    });
  });

  describe('loadModel', () => {
    it('should load the face detection model', async () => {
      await detector.loadModel();

      expect(getVisionFileset).toHaveBeenCalled();
      expect(FaceDetector.createFromOptions).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          baseOptions: expect.objectContaining({
            modelAssetPath: MODEL_ASSET_PATH,
            delegate: 'GPU',
          }),
          runningMode: 'VIDEO',
        }),
      );
      expect(detector.detector).not.toBeNull();
    });
  });

  describe('load', () => {
    it('should load video element and model', async () => {
      const mockVideo = documentMock.createElement('video');
      await detector.load({ $video: mockVideo });

      expect(detector.detector).not.toBeNull();
      expect(detector.$video).toBe(mockVideo);
      expect(navigatorMock.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
  });

  describe('start', () => {
    it('should start face detection and call renderCallback', async () => {
      const mockVideo = documentMock.createElement('video');
      const renderCallback = vi.fn();

      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedRawFaces).toHaveLength(1);
      expect(renderCallback).toHaveBeenCalled();
      expect(windowMock.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not start if detector is not loaded', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      await detector.start();

      expect(consoleSpy).toHaveBeenCalledWith(
        'detector is empty. you should load model',
      );
      expect(detector.detectedRawFaces).toHaveLength(0);
    });
  });

  describe('stop', () => {
    it('should stop detection and clean up resources', async () => {
      const mockVideo = documentMock.createElement('video');
      await detector.load({ $video: mockVideo });
      await detector.start();

      detector.stop();

      expect(detector.detector).toBeNull();
      expect(detector.detectedRawFaces).toHaveLength(0);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(windowMock.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('detectedFaces', () => {
    it('should return transformed face detection results', async () => {
      const mockVideo = documentMock.createElement('video');
      await detector.load({ $video: mockVideo });
      await detector.start();

      const faces = detector.detectedFaces;
      expect(faces).toHaveLength(1);
      expect(faces[0].box).toEqual({
        width: 100,
        height: 100,
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 100,
      });
      expect(faces[0].keypoints).toHaveLength(3);
    });
  });
});
