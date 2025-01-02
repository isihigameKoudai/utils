import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

import { FaceLandmarkDetection } from './FaceLandmarkDetection';
import { documentMock, navigatorMock, windowMock } from '../../__test__/mocks/global';

vi.mock('@tensorflow-models/face-landmarks-detection', () => ({
  SupportedModels: {
    MediaPipeFaceMesh: 'MediaPipeFaceMesh'
  },
  createDetector: vi.fn().mockResolvedValue({
    estimateFaces: vi.fn().mockResolvedValue([
      {
        box: { xMin: 0, yMin: 0, xMax: 100, yMax: 100, width: 100, height: 100 },
        keypoints: [
          { x: 50, y: 50, z: 0, name: 'nose_tip' },
          { x: 30, y: 30, z: 0, name: 'left_eye' },
          { x: 70, y: 30, z: 0, name: 'right_eye' }
        ],
        annotations: {
          leftEyeIris: [[30, 30, 0]],
          rightEyeIris: [[70, 30, 0]]
        }
      }
    ])
  })
}));

describe('FaceLandmarkDetection', () => {
  let detector: FaceLandmarkDetection;

  beforeEach(() => {
    vi.stubGlobal('navigator', navigatorMock);
    vi.stubGlobal('document', documentMock);
    vi.stubGlobal('window', windowMock);
    detector = new FaceLandmarkDetection();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      expect(detector.model).toBe(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh);
      expect(detector.detector).toBeNull();
      expect(detector.detectedRawFaces).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(detector._isRunning).toBe(false);
    });
  });

  describe('loadModel', () => {
    it('should load the face landmark detection model', async () => {
      await detector.loadModel();
      expect(faceLandmarksDetection.createDetector).toHaveBeenCalledWith(
        detector.model,
        {
          runtime: 'tfjs',
          refineLandmarks: true
        }
      );
      expect(detector.detector).not.toBeNull();
    });

    it('should handle model loading errors', async () => {
      const error = new Error('Model loading failed');
      vi.mocked(faceLandmarksDetection.createDetector).mockRejectedValueOnce(error);
      const consoleSpy = vi.spyOn(console, 'error');
      
      await detector.loadModel();
      
      expect(consoleSpy).toHaveBeenCalledWith('モデル読み込みエラー:', error);
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
    it('should start face landmark detection and call renderCallback', async () => {
      const mockVideo = document.createElement('video');
      const renderCallback = vi.fn();
      
      await detector.load({ $video: mockVideo });
      await detector.start(renderCallback);

      expect(detector.detectedRawFaces).toHaveLength(1);
      expect(renderCallback).toHaveBeenCalledWith(detector.detectedRawFaces);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should not start if detector is not loaded', async () => {
      const consoleSpy = vi.spyOn(console, 'error');
      await detector.start();
      
      expect(consoleSpy).toHaveBeenCalledWith('detector is empty. you should load model');
      expect(detector.detectedRawFaces).toHaveLength(0);
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
      expect(detector.detectedRawFaces).toHaveLength(0);
      expect(detector.requestAnimationFrameId).toBe(0);
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
