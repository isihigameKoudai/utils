import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

import { HandPoseDetection } from './HandPoseDetection';
import { documentMock, navigatorMock, windowMock } from '../../__test__/mocks/global';

vi.mock('@tensorflow-models/hand-pose-detection', () => ({
  SupportedModels: {
    MediaPipeHands: 'MediaPipeHands'
  },
  createDetector: vi.fn().mockResolvedValue({
    estimateHands: vi.fn().mockResolvedValue([
      {
        keypoints: [
          { x: 0, y: 0, name: 'wrist' },
          { x: 10, y: 10, name: 'thumb_tip' },
          { x: 20, y: 20, name: 'index_finger_tip' }
        ],
        handedness: 'Left',
        score: 0.98
      },
      {
        keypoints: [
          { x: 100, y: 100, name: 'wrist' },
          { x: 110, y: 110, name: 'thumb_tip' },
          { x: 120, y: 120, name: 'index_finger_tip' }
        ],
        handedness: 'Right',
        score: 0.96
      }
    ])
  })
}));

describe('HandPoseDetection', () => {
  let detector: HandPoseDetection;

  beforeEach(() => {
    vi.stubGlobal('navigator', navigatorMock);
    vi.stubGlobal('document', documentMock);
    vi.stubGlobal('window', windowMock);
    detector = new HandPoseDetection();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(detector.model).toBe(handPoseDetection.SupportedModels.MediaPipeHands);
      expect(detector.detector).toBeNull();
      expect(detector.detectedRawHands).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
    });
  });

  describe('loadModel', () => {
    it('should load the hand pose detection model', async () => {
      await detector.loadModel();
      expect(handPoseDetection.createDetector).toHaveBeenCalledWith(
        detector.model,
        {
          runtime: 'tfjs'
        }
      );
      expect(detector.detector).not.toBeNull();
    });

    it('should handle model loading errors', async () => {
      const error = new Error('Model loading failed');
      vi.mocked(handPoseDetection.createDetector).mockRejectedValueOnce(error);
      const consoleSpy = vi.spyOn(console, 'error');
      
      await detector.loadModel();
      
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(detector.detector).toBeNull();
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
    it('should start hand detection and call renderCallback with both hands', async () => {
      const mockVideo = document.createElement('video');
      const renderCallback = vi.fn();
      
      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedRawHands).toHaveLength(2);
      expect(renderCallback).toHaveBeenCalledWith(detector.detectedRawHands);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should detect both left and right hands', async () => {
      const mockVideo = document.createElement('video');
      await detector.load({ $video: mockVideo });
      await detector.start();

      const hands = detector.detectedRawHands;
      expect(hands[0].handedness).toBe('Left');
      expect(hands[1].handedness).toBe('Right');
    });

    it('should not start if detector is not loaded', async () => {
      const consoleSpy = vi.spyOn(console, 'error');
      await detector.start();
      
      expect(consoleSpy).toHaveBeenCalledWith('detector is empty. you should load model');
      expect(detector.detectedRawHands).toHaveLength(0);
    });

    it('should not start if video is not loaded', async () => {
      await detector.loadModel();
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
      expect(detector.detectedRawHands).toHaveLength(0);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
