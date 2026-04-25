import { HandLandmarker } from '@mediapipe/tasks-vision';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  documentMock,
  navigatorMock,
  windowMock,
} from '../../__test__/mocks/global';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import { HandPoseDetection } from './HandPoseDetection';

vi.mock('../vision', () => ({
  getVisionFileset: vi.fn().mockResolvedValue({}),
}));

vi.mock('@mediapipe/tasks-vision', () => ({
  HandLandmarker: {
    createFromOptions: vi.fn(),
  },
}));

describe('HandPoseDetection', () => {
  let detector: HandPoseDetection;

  beforeEach(() => {
    vi.mocked(HandLandmarker.createFromOptions).mockResolvedValue({
      setOptions: vi.fn(),
      detect: vi.fn(),
      detectForVideo: vi.fn().mockReturnValue({
        landmarks: [
          [
            { x: 0, y: 0, z: 0 },
            { x: 0.1, y: 0.1, z: 0 },
            { x: 0.2, y: 0.2, z: 0 },
          ],
          [
            { x: 0.5, y: 0.5, z: 0 },
            { x: 0.6, y: 0.6, z: 0 },
            { x: 0.7, y: 0.7, z: 0 },
          ],
        ],
        handedness: [
          [{ categoryName: 'Left', score: 0.98, index: 0, displayName: '' }],
          [{ categoryName: 'Right', score: 0.96, index: 1, displayName: '' }],
        ],
      }),
      close: vi.fn(),
    });

    detector = new HandPoseDetection({
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
      expect(detector.model).toBe('MediaPipeHands');
      expect(detector.detector).toBeNull();
      expect(detector.detectedRawHands).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
    });
  });

  describe('loadModel', () => {
    it('should load the hand pose detection model', async () => {
      await detector.loadModel();

      expect(getVisionFileset).toHaveBeenCalled();
      expect(HandLandmarker.createFromOptions).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          baseOptions: expect.objectContaining({
            modelAssetPath: MODEL_ASSET_PATH,
            delegate: 'GPU',
          }),
          runningMode: 'VIDEO',
          numHands: 2,
        }),
      );
      expect(detector.detector).not.toBeNull();
    });

    it('should handle model loading errors', async () => {
      const error = new Error('Model loading failed');
      vi.mocked(HandLandmarker.createFromOptions).mockRejectedValueOnce(error);
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await detector.loadModel();

      expect(consoleSpy).toHaveBeenCalledWith(error);
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
    it('should start hand detection and call renderCallback with both hands', async () => {
      const mockVideo = documentMock.createElement('video');
      const renderCallback = vi.fn();

      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedRawHands).toHaveLength(2);
      expect(renderCallback).toHaveBeenCalledWith(detector.detectedRawHands);
      expect(windowMock.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should detect both left and right hands', async () => {
      const mockVideo = documentMock.createElement('video');
      await detector.load({ $video: mockVideo });
      await detector.start();

      const hands = detector.detectedRawHands;
      expect(hands[0].handedness).toBe('Left');
      expect(hands[1].handedness).toBe('Right');
      expect(hands[0].keypoints[0].name).toBe('wrist');
    });

    it('should not start if detector is not loaded', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      await detector.start();

      expect(consoleSpy).toHaveBeenCalledWith(
        'detector is empty. you should load model',
      );
      expect(detector.detectedRawHands).toHaveLength(0);
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
      expect(detector.detectedRawHands).toHaveLength(0);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(windowMock.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
