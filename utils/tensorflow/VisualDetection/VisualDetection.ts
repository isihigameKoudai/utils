/**
 * npm i @tensorflow/tfjs @tensorflow-models/coco-ssd
 */
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

import {
  INITIAL_VIDEO_EL_WIDTH,
  INITIAL_VIDEO_EL_HEIGHT,
} from '../../Media/constants';
import { DetectedObject, RenderCallBack } from './type';
import { Video } from '../../Media/Video';
import { ElOption } from '../type';

/**
 * Detect some objects by using camera;
 * powered by tensorflow.js cocossd model;
 * https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
 */
export class VisualDetection extends Video {
  _model: cocoSsd.ObjectDetection | null;
  _detectedRawObjects: cocoSsd.DetectedObject[];
  _requestAnimationFrameId: number;

  constructor() {
    super();
    this._model = null;
    this._detectedRawObjects = [];
    this._requestAnimationFrameId = 0;
  }

  get model() {
    return this._model;
  }

  get detectedRawObjects() {
    return this._detectedRawObjects;
  }

  get detectedObjects(): DetectedObject[] {
    return (this.detectedRawObjects || []).map((obj) => {
      const { x: timesX, y: timesY } = this.magnification;
      const left = obj.bbox[0] * timesX;
      const top = obj.bbox[1] * timesY;
      const width = obj.bbox[2] * timesX;
      const height = obj.bbox[3] * timesY;
      const centerX = (obj.bbox[0] + obj.bbox[2] / 2) * timesX;
      const centerY = (obj.bbox[1] + obj.bbox[3] / 2) * timesY;

      return {
        left,
        top,
        width,
        height,
        class: obj.class,
        score: obj.score,
        center: {
          x: centerX,
          y: centerY,
        },
      };
    });
  }

  async loadModel(config: cocoSsd.ModelConfig = {}) {
    try {
      await tf.ready();
      this._model = await cocoSsd.load(config);
      return this.model;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

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

  async load(
    elConfig?: ElOption,
    modelConfig: cocoSsd.ModelConfig = {},
  ): Promise<HTMLVideoElement> {
    const $video = await this.loadEl(elConfig || {});
    await this.loadModel(modelConfig);
    return $video;
  }

  async start(renderCallBack?: RenderCallBack) {
    if (!this.model) {
      console.error('model is empty. you should load model');
      return;
    }

    if (!this.$video) {
      console.error('$video is empty.');
      return;
    }

    const detectedRawObjects = await this.model.detect(this.$video);
    this._detectedRawObjects = detectedRawObjects;

    if (renderCallBack) {
      renderCallBack(this.detectedObjects);
    }

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedRawObjects = [];
    this._requestAnimationFrameId = 0;
    this._model = null;
  }
}
