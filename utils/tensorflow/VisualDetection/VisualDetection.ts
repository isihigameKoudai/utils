import { ObjectDetector, type Detection } from '@mediapipe/tasks-vision';

import {
  INITIAL_VIDEO_EL_HEIGHT,
  INITIAL_VIDEO_EL_WIDTH,
} from '../../Media/constants';
import { Video } from '../../Media/Video';
import type { ElOption } from '../type';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import type { DetectedObject, ModelConfig, RenderCallBack } from './type';

interface Params {
  navigator: Navigator;
  document: Document;
  window: Window & typeof globalThis;
}

export class VisualDetection extends Video {
  _model: ObjectDetector | null;
  _detectedRawObjects: Detection[];
  _requestAnimationFrameId: number;

  private document: Document;
  private window: Window & typeof globalThis;

  constructor(params: Params) {
    super(params);
    this.document = params.document;
    this.window = params.window;
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
    return (this.detectedRawObjects || []).map((detectedObject) => {
      const { x: timesX, y: timesY } = this.magnification;
      const box = detectedObject.boundingBox;
      const left = (box?.originX ?? 0) * timesX;
      const top = (box?.originY ?? 0) * timesY;
      const width = (box?.width ?? 0) * timesX;
      const height = (box?.height ?? 0) * timesY;
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const topCategory = detectedObject.categories[0];

      return {
        left,
        top,
        width,
        height,
        class: topCategory?.categoryName ?? '',
        score: topCategory?.score ?? 0,
        center: {
          x: centerX,
          y: centerY,
        },
      };
    });
  }

  async loadModel(config: ModelConfig = {}) {
    try {
      const fileset = await getVisionFileset();
      this._model = await ObjectDetector.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_PATH,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        scoreThreshold: config.scoreThreshold ?? 0.3,
      });
      return this.model;
    } catch (error) {
      console.error(error);
      throw error;
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

    const videoEl = $video || this.document.createElement('video');
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.width = width;
    videoEl.height = height;
    this.setVideo(videoEl);
    return videoEl;
  }

  async load(
    elConfig?: ElOption,
    modelConfig: ModelConfig = {},
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

    const detectedRawObjects = this.model.detectForVideo(
      this.$video,
      performance.now(),
    );
    this._detectedRawObjects = detectedRawObjects.detections;

    if (renderCallBack) {
      renderCallBack(this.detectedObjects);
    }

    this._requestAnimationFrameId = this.window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    this.window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedRawObjects = [];
    this._requestAnimationFrameId = 0;
    this._model = null;
  }
}
