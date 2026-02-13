import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  documentMock,
  navigatorMock,
  windowMock,
} from '../../__test__/mocks/global';

import { PoseDetection } from './PoseDetection';

vi.mock('@tensorflow/tfjs', () => ({
  ready: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@tensorflow-models/pose-detection', () => ({
  SupportedModels: {
    MoveNet: 'MoveNet',
    BlazePose: 'BlazePose',
    PoseNet: 'PoseNet',
  },
  createDetector: vi.fn().mockResolvedValue({
    estimatePoses: vi.fn().mockResolvedValue([
      {
        keypoints: [
          { x: 0, y: 0, score: 0.9, name: 'nose' },
          { x: 10, y: 10, score: 0.8, name: 'left_eye' },
          { x: 20, y: 20, score: 0.85, name: 'right_eye' },
        ],
        score: 0.9,
      },
    ]),
  }),
  movenet: {
    modelType: {
      SINGLEPOSE_LIGHTNING: 'SINGLEPOSE_LIGHTNING',
    },
  },
}));

describe('PoseDetection', () => {
  let detector: PoseDetection;

  beforeEach(() => {
    vi.stubGlobal('navigator', navigatorMock);
    vi.stubGlobal('document', documentMock);
    vi.stubGlobal('window', windowMock);
    detector = new PoseDetection();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(detector.model).toBe(poseDetection.SupportedModels.MoveNet);
      expect(detector.detector).toBeNull();
      expect(detector.detectedPoses).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
    });
  });

  describe('loadDetector', () => {
    it('should load the pose detection model', async () => {
      await detector.loadDetector();
      expect(tf.ready).toHaveBeenCalled();
      expect(poseDetection.createDetector).toHaveBeenCalled();
      expect(detector.detector).not.toBeNull();
    });

    it('should handle model loading errors', async () => {
      const error = new Error('Model loading failed');
      vi.mocked(poseDetection.createDetector).mockRejectedValueOnce(error);
      const consoleSpy = vi.spyOn(console, 'error');

      await expect(detector.loadDetector()).rejects.toThrow(error);
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('load', () => {
    it('should load video element and model', async () => {
      const mockVideo = document.createElement('video');
      await detector.load({ $video: mockVideo });

      expect(detector.detector).not.toBeNull();
      expect(detector.$video).toBe(mockVideo);
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });

    it('should create new video element if none provided', async () => {
      await detector.load();

      expect(detector.$video).not.toBeNull();
      expect(document.createElement).toHaveBeenCalledWith('video');
    });
  });

  describe('start', () => {
    it('should start pose detection and call renderCallback', async () => {
      const mockVideo = document.createElement('video');
      const renderCallback = vi.fn();

      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedPoses).toHaveLength(1);
      expect(renderCallback).toHaveBeenCalledWith(detector.detectedPoses);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not start if detector is not loaded', async () => {
      const consoleSpy = vi.spyOn(console, 'error');
      await detector.start();

      expect(consoleSpy).toHaveBeenCalledWith(
        'detector is empty. you should load detector',
      );
      expect(detector.detectedPoses).toHaveLength(0);
    });

    it('should not start if video is not loaded', async () => {
      await detector.loadDetector();
      const consoleSpy = vi.spyOn(console, 'error');

      await detector.start();

      expect(consoleSpy).toHaveBeenCalledWith('$video is empty.');
    });
  });

  describe('stop', () => {
    it('should stop detection and clean up resources', async () => {
      const mockVideo = document.createElement('video');
      await detector.load({ $video: mockVideo });
      await detector.start();

      detector.stop();

      expect(detector.detector).toBeNull();
      expect(detector.detectedPoses).toHaveLength(0);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
