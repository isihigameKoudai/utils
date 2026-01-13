/**
 * npm i @tensorflow/tfjs @tensorflow-models/face-detection
 */
import * as tf from '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';

import {
  INITIAL_VIDEO_EL_WIDTH,
  INITIAL_VIDEO_EL_HEIGHT,
} from '../../Media/constants';
import { Video } from '../../Media/Video';
import type { ElOption } from '../type';

import type { RenderCallBack } from './type';

export class FaceDetection extends Video {
  _model: faceDetection.SupportedModels;

  _detector: faceDetection.FaceDetector | null;

  _detectedRawFaces: faceDetection.Face[];

  _requestAnimationFrameId: number;

  constructor() {
    super();
    this._model = faceDetection.SupportedModels.MediaPipeFaceDetector;
    this._detector = null;
    this._detectedRawFaces = [];
    this._requestAnimationFrameId = 0;
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

  get detectedFaces(): faceDetection.Face[] {
    return this.detectedRawFaces.map((face) => {
      const { x: timesX, y: timesY } = this.magnification;
      return {
        box: {
          width: face.box.width * timesX,
          height: face.box.height * timesY,
          xMin: face.box.xMin * timesX,
          xMax: face.box.xMax * timesX,
          yMin: face.box.yMin * timesY,
          yMax: face.box.yMax * timesY,
        },
        keypoints: face.keypoints.map((keypoint) => {
          return {
            x: keypoint.x * timesX,
            y: keypoint.y * timesY,
            name: keypoint.name,
          };
        }),
      };
    });
  }

  async loadModel() {
    try {
      await tf.ready();
      const detector = await faceDetection.createDetector(this._model, {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection',
      });
      this._detector = detector;
    } catch (error) {
      console.error(error);
    }
  }

  // 共通化
  async loadEl({
    $video,
    width = INITIAL_VIDEO_EL_WIDTH,
    height = INITIAL_VIDEO_EL_HEIGHT,
  }: ElOption): Promise<HTMLVideoElement> {
    await this.getVideoStream();
    this.setMagnification({
      x: width / INITIAL_VIDEO_EL_WIDTH,
      y: height / INITIAL_VIDEO_EL_HEIGHT,
    });

    const videoEl = $video || document.createElement('video');
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.width = width;
    videoEl.height = height;
    this.setVideo(videoEl);
    return videoEl;
  }

  async load(elConfig?: ElOption) {
    await this.loadEl(elConfig || {});
    await this.loadModel();
  }

  async start(renderCallBack?: RenderCallBack) {
    if (!this.detector) {
      console.error('detector is empty. you should load model');
      return;
    }

    if (!this.$video) {
      console.error('$video is empty.');
      return;
    }

    const faces = await this.detector.estimateFaces(this.$video, {
      flipHorizontal: false,
    });

    this._detectedRawFaces = faces;

    renderCallBack?.(this.detectedFaces);

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedRawFaces = [];
    this._requestAnimationFrameId = 0;
    this._detector = null;
  }
}
