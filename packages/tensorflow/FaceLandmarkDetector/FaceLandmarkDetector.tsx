/**
 * npm i @tensorflow/tfjs @tensorflow-models/face-landmarks-detection
 */
import '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

import { Video } from '../../Media/Video';

export class FaceLandmarkDetector extends Video {
  
  _model: faceLandmarksDetection.SupportedModels;
  _detector: faceLandmarksDetection.FaceLandmarksDetector | null;
  _detectedRawFaces: faceLandmarksDetection.Face[];
  _requestAnimationFrameId: number;
  _isRunning: boolean;

  constructor() {
    super();
    this._model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    this._detector = null;
    this._detectedRawFaces = [];
    this._requestAnimationFrameId = 0;
    this._isRunning = false;
  }

  get model() {
    return this._model;
  }

  get detector() {
    return this._detector;
  }

  get detectedRawFaces() {
    return this._detectedRawFaces;
  }

  get requestAnimationFrameId() {
    return this._requestAnimationFrameId;
  }

  async loadModel() {
    try {
      this._detector = await faceLandmarksDetection.createDetector(this._model, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        refineLandmarks: true
      });
    } catch (error) {
      console.error('モデルの読み込みに失敗しました:');
      throw new Error('モデルの読み込みに失敗しました');
    }
  }


}
