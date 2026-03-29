import { FaceLandmarker } from '@mediapipe/tasks-vision';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  documentMock,
  navigatorMock,
  windowMock,
} from '../../__test__/mocks/global';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import { FaceLandmarkDetection } from './FaceLandmarkDetection';

vi.mock('../vision', () => ({
  getVisionFileset: vi.fn().mockResolvedValue({}),
}));

vi.mock('@mediapipe/tasks-vision', () => ({
  FaceLandmarker: {
    createFromOptions: vi.fn(),
  },
}));

describe('FaceLandmarkDetection', () => {
  let detector: FaceLandmarkDetection;

  beforeEach(() => {
    vi.mocked(FaceLandmarker.createFromOptions).mockResolvedValue({
      setOptions: vi.fn(),
      detect: vi.fn(),
      detectForVideo: vi.fn().mockReturnValue({
        faceLandmarks: [
          [
            { x: 0.1, y: 0.1, z: 0 },
            { x: 0.5, y: 0.5, z: 0 },
            { x: 0.8, y: 0.8, z: 0 },
          ],
        ],
        faceBlendshapes: [],
        facialTransformationMatrixes: [],
      }),
      close: vi.fn(),
    });

    detector = new FaceLandmarkDetection({
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
      expect(detector.model).toBe('MediaPipeFaceMesh');
      expect(detector.detector).toBeNull();
      expect(detector.detectedRawFaces).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(detector._isRunning).toBe(false);
    });
  });

  describe('loadModel', () => {
    it('should load the face landmark detection model', async () => {
      await detector.loadModel();

      expect(getVisionFileset).toHaveBeenCalled();
      expect(FaceLandmarker.createFromOptions).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          baseOptions: expect.objectContaining({
            modelAssetPath: MODEL_ASSET_PATH,
            delegate: 'GPU',
          }),
          runningMode: 'VIDEO',
          numFaces: 1,
        }),
      );
      expect(detector.detector).not.toBeNull();
    });

    it('should handle model loading errors', async () => {
      const error = new Error('Model loading failed');
      vi.mocked(FaceLandmarker.createFromOptions).mockRejectedValueOnce(error);
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await detector.loadModel();

      expect(consoleSpy).toHaveBeenCalledWith('モデル読み込みエラー:', error);
      expect(detector.detector).toBeNull();
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

    it('should create new video element if none provided', async () => {
      await detector.load();

      expect(detector.$video).not.toBeNull();
      expect(documentMock.createElement).toHaveBeenCalledWith('video');
    });
  });

  describe('start', () => {
    it('should start face landmark detection and call renderCallback', async () => {
      const mockVideo = documentMock.createElement('video');
      const renderCallback = vi.fn();

      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedRawFaces).toHaveLength(1);
      expect(renderCallback).toHaveBeenCalledWith(detector.detectedRawFaces);
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

    it('should not start if video is not loaded', async () => {
      await detector.loadModel();
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await detector.start();

      expect(consoleSpy).toHaveBeenCalledWith('$video is empty.');
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
});
