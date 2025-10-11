/**
 * npm i @tensorflow/tfjs @tensorflow-models/face-landmarks-detection
 */
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

import { Video } from '../../Media/Video';
import { INITIAL_VIDEO_EL_HEIGHT, INITIAL_VIDEO_EL_WIDTH } from '../../Media';
import { ElOption } from '../type';
import { RenderCallBack } from './type';

export class FaceLandmarkDetection extends Video {
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
      await tf.ready();
      this._detector = await faceLandmarksDetection.createDetector(this.model, {
        runtime: 'tfjs',
        refineLandmarks: true,
      });
    } catch (error) {
      console.error('モデル読み込みエラー:', error);
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

    const detectedRawFaces = await this.detector.estimateFaces(this.$video, {
      flipHorizontal: false,
    });

    this._detectedRawFaces = detectedRawFaces;

    // TODO: detectedRawFacesを使ったgettersをrenderCallBackに渡す
    renderCallBack?.(this.detectedRawFaces);

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
