import * as faceDetection from '@tensorflow-models/face-detection';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  documentMock,
  navigatorMock,
  windowMock,
} from '../../__test__/mocks/global';

import { FaceDetection } from './FaceDetection';

vi.mock('@tensorflow-models/face-detection', () => ({
  SupportedModels: {
    MediaPipeFaceDetector: 'MediaPipeFaceDetector',
  },
  createDetector: vi.fn().mockResolvedValue({
    estimateFaces: vi.fn().mockResolvedValue([
      {
        box: {
          width: 100,
          height: 100,
          xMin: 0,
          xMax: 100,
          yMin: 0,
          yMax: 100,
        },
        keypoints: [
          { x: 50, y: 50, name: 'nose' },
          { x: 30, y: 30, name: 'leftEye' },
          { x: 70, y: 30, name: 'rightEye' },
        ],
      },
    ]),
  }),
}));

describe('FaceDetection', () => {
  let detector: FaceDetection;

  beforeEach(() => {
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
      expect(detector.model).toBe(
        faceDetection.SupportedModels.MediaPipeFaceDetector,
      );
      expect(detector.detector).toBeNull();
      expect(detector.detectedRawFaces).toEqual([]);
      expect(detector.requestAnimationFrameId).toBe(0);
    });
  });

  describe('loadModel', () => {
    it('should load the face detection model', async () => {
      await detector.loadModel();
      expect(faceDetection.createDetector).toHaveBeenCalledWith(
        detector.model,
        {
          runtime: 'mediapipe',
          solutionPath:
            'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection',
        },
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
      const consoleSpy = vi.spyOn(console, 'error');
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
