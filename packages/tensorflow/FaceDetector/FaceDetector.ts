/**
 * npm i @tensorflow/tfjs @tensorflow-models/face-detection
 */
import '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

import { INITIAL_VIDEO_EL_WIDTH, INITIAL_VIDEO_EL_HEIGHT } from '../constants';
import {
  LoadElProps,
  RenderCallBack
} from './type';

export class FaceDetector {
  _model: faceDetection.SupportedModels;
  _detector: faceDetection.FaceDetector | null;
  _detectedFaces: faceDetection.Face[];
  
  _requestAnimationFrameId: number;
  _magnification: { x: number; y: number };
  _$video: HTMLVideoElement | null;
  _stream: MediaStream | null;

  constructor() {
    this._model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    this._requestAnimationFrameId = 0;
    /**
     * 設定されたvideo elementがtensorflow.jsの基準値（width: 640, height: 480）から、何倍かを保存する。
     */
    this._magnification = {
      x: 1,
      y: 1
    };
    this._stream = null;
    this._$video = null;
    this._detector = null;
    this._detectedFaces = [];
  }

  get model() {
    return this._model;
  }

  get detector() {
    return this._detector;
  }

  get $video() {
    return this._$video;
  }

  get stream() {
    return this._stream;
  }
  
  get detectedFaces() {
    return this._detectedFaces;
  }

  async loadModel() {
    try {
      const detector = await faceDetection.createDetector(this._model, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection'
      });
      this._detector = detector;
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: 共通化
  async loadEl({
    $video,
    width = INITIAL_VIDEO_EL_WIDTH,
    height = INITIAL_VIDEO_EL_HEIGHT
  }:LoadElProps): Promise<HTMLVideoElement> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    this._stream = stream;

    this._magnification = {
      x: width / INITIAL_VIDEO_EL_WIDTH,
      y: height / INITIAL_VIDEO_EL_HEIGHT
    }

    if (!$video) {
      const _$video = document.createElement('video');
      _$video.muted = true;
      _$video.autoplay = true;
      _$video.width = width;
      _$video.height = height;
      _$video.srcObject = stream;
      this._$video = _$video;
      return _$video;
    }
    $video.width = width;
    $video.height = height;
    $video.srcObject = stream;
    $video.autoplay = true;
    $video.muted = true;
    this._$video = $video;

    return $video;
  }

  async load(elConfig?: LoadElProps) {
    const $video = this.loadEl(elConfig || {});
    await this.loadModel();
    return $video;
  }

  async start(renderCallBack?: RenderCallBack) {
    if(!this.detector) {
      console.error('detector is empty. you should load model');
      return
    }

    if(!this.$video) {
      console.error('$video is empty.');
      return
    }

    if(!this.detector) {
      console.error('detector is empty. you should load model');
      return
    }

    const faces = await this.detector.estimateFaces(this.$video, {
      flipHorizontal: false
    });

    this._detectedFaces = faces;

    if(renderCallBack) {
      renderCallBack(this.detectedFaces);
    }
    
    this._requestAnimationFrameId = window.requestAnimationFrame(this.start.bind(this, renderCallBack));
  }
};
