import { PoseLandmarker } from '@mediapipe/tasks-vision';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  documentMock,
  navigatorMock,
  windowMock,
} from '../../__test__/mocks/global';
import { getVisionFileset } from '../vision';

import { POSE_LANDMARKER_LITE_PATH } from './constants';
import { PoseDetection } from './PoseDetection';

vi.mock('../vision', () => ({
  getVisionFileset: vi.fn().mockResolvedValue({}),
}));

vi.mock('@mediapipe/tasks-vision', () => ({
  PoseLandmarker: {
    createFromOptions: vi.fn(),
  },
}));

describe('PoseDetection', () => {
  let detector: PoseDetection;

  beforeEach(() => {
    vi.mocked(PoseLandmarker.createFromOptions).mockResolvedValue({
      setOptions: vi.fn(),
      detect: vi.fn(),
      detectForVideo: vi.fn().mockReturnValue({
        landmarks: [
          [
            { x: 0, y: 0, z: 0, visibility: 0.9 },
            { x: 0.1, y: 0.1, z: 0, visibility: 0.8 },
            { x: 0.2, y: 0.2, z: 0, visibility: 0.85 },
            { x: 0.3, y: 0.3, z: 0, visibility: 0.85 },
            { x: 0.4, y: 0.4, z: 0, visibility: 0.85 },
            { x: 0.5, y: 0.5, z: 0, visibility: 0.85 },
            { x: 0.6, y: 0.6, z: 0, visibility: 0.85 },
            { x: 0.7, y: 0.7, z: 0, visibility: 0.85 },
            { x: 0.8, y: 0.8, z: 0, visibility: 0.85 },
            { x: 0.9, y: 0.9, z: 0, visibility: 0.85 },
            { x: 1, y: 1, z: 0, visibility: 0.85 },
            { x: 0.4, y: 0.4, z: 0, visibility: 0.85 },
            { x: 0.5, y: 0.5, z: 0, visibility: 0.85 },
          ],
        ],
        worldLandmarks: [],
      }),
      close: vi.fn(),
    });

    detector = new PoseDetection({
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
      expect(detector.model).toBe('MoveNet');
      expect(detector.detector).toBeNull();
      expect(detector.detectedPoses).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
    });
  });

  describe('loadDetector', () => {
    it('should load the pose detection model', async () => {
      await detector.loadDetector();

      expect(getVisionFileset).toHaveBeenCalled();
      expect(PoseLandmarker.createFromOptions).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          baseOptions: expect.objectContaining({
            modelAssetPath: POSE_LANDMARKER_LITE_PATH,
            delegate: 'GPU',
          }),
          runningMode: 'VIDEO',
          numPoses: 1,
        }),
      );
      expect(detector.detector).not.toBeNull();
    });

    it('should handle model loading errors', async () => {
      const error = new Error('Model loading failed');
      vi.mocked(PoseLandmarker.createFromOptions).mockRejectedValueOnce(error);
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(detector.loadDetector()).rejects.toThrow(error);
      expect(consoleSpy).toHaveBeenCalledWith(error);
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
    it('should start pose detection and call renderCallback', async () => {
      const mockVideo = documentMock.createElement('video');
      const renderCallback = vi.fn();

      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedPoses).toHaveLength(1);
      expect(renderCallback).toHaveBeenCalledWith(detector.detectedPoses);
      expect(windowMock.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should keep landmark names for find lookups', async () => {
      const mockVideo = documentMock.createElement('video');
      await detector.load({ $video: mockVideo });
      await detector.start();

      const leftShoulder = detector.detectedPoses[0].keypoints.find(
        (keypoint) => keypoint.name === 'left_shoulder',
      );
      expect(leftShoulder).toBeDefined();
    });

    it('should not start if detector is not loaded', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      await detector.start();

      expect(consoleSpy).toHaveBeenCalledWith(
        'detector is empty. you should load detector',
      );
      expect(detector.detectedPoses).toHaveLength(0);
    });

    it('should not start if video is not loaded', async () => {
      await detector.loadDetector();
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
      expect(detector.detectedPoses).toHaveLength(0);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(windowMock.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
