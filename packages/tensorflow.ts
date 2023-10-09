import '@tensorflow/tfjs';

import * as cocoSsd from '@tensorflow-models/coco-ssd';

type LoadElProps = {
  $video?: HTMLVideoElement;
  width?: HTMLVideoElement['width'];
  height?: HTMLVideoElement['height'];
};

export type DetectedObject = {
  class: cocoSsd.DetectedObject['class'];
  left: cocoSsd.DetectedObject['bbox'][0];
  top: cocoSsd.DetectedObject['bbox'][1];
  width: cocoSsd.DetectedObject['bbox'][2];
  height: cocoSsd.DetectedObject['bbox'][3];
  center: {
    x: number;
    y: number;
  };
  score: cocoSsd.DetectedObject['score']
}
type RenderCallBack = (objects: DetectedObject[]) => void | Promise<void>;

const INITIAL_VIDEO_EL_WIDTH = 640 as const;
const INITIAL_VIDEO_EL_HEIGHT = 480 as const;

/**
 * Detect some objects by using camera;
 * powered by tensorflow.js cocossd model;
 * https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
 */
export class VisualDetector {
  _model: cocoSsd.ObjectDetection | null;
  _$video: HTMLVideoElement | null;
  _detectedObjects: cocoSsd.DetectedObject[];
  _requestAnimationFrameId: number;
  _magnification: { x: number; y: number };

  constructor() {
    this._model = null;
    this._$video = null;
    this._detectedObjects = [];
    this._requestAnimationFrameId = 0;
    /**
     * 設定されたvideo elementがtensorflow.jsの基準値（width: 640, height: 480）から、何倍かを保存する。
     */
    this._magnification = {
      x: 1,
      y: 1
    };
  }

  get model() {
    return this._model;
  }

  get $video() {
    return this._$video;
  }

  get detectedObjects() {
    return this._detectedObjects;
  }

  get magnification() {
    return this._magnification;
  }

  async loadModel(config: cocoSsd.ModelConfig = {}) {
    try {
      this._model = await cocoSsd.load(config);
      return this.model;
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  async loadEl({ $video, width = INITIAL_VIDEO_EL_WIDTH, height = INITIAL_VIDEO_EL_HEIGHT }:LoadElProps): Promise<HTMLVideoElement> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

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
    this._$video = $video;
    return $video;
  }

  async load(elConfig?: LoadElProps, modelConfig: cocoSsd.ModelConfig = {}): Promise<HTMLVideoElement> {
    const $video = this.loadEl(elConfig || {});
    await this.loadModel(modelConfig);

    return $video;
  }

  async start(renderCallBack?: RenderCallBack) {
    if(!this.model) {
      console.error('model is empty. you should load model');
      return
    }

    if(!this.$video) {
      console.error('$video is empty.');
      return
    }

    const detectedObjects = await this.model.detect(this.$video);
    this._detectedObjects = detectedObjects;

    const computedDetectedObjectList: DetectedObject[] = detectedObjects.map(obj => {
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
          y: centerY
        }
      }
    });

    if(renderCallBack) {
      renderCallBack(computedDetectedObjectList);
    }
    
    this._requestAnimationFrameId = window.requestAnimationFrame(this.start.bind(this, renderCallBack));
  }
}