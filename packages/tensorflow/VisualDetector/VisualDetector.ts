/**
 * npm i @tensorflow/tfjs @tensorflow-models/coco-ssd
 */
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

import { INITIAL_VIDEO_EL_WIDTH, INITIAL_VIDEO_EL_HEIGHT } from '../constants';
import { LoadElProps, DetectedObject, RenderCallBack } from './type';
/**
 * Detect some objects by using camera;
 * powered by tensorflow.js cocossd model;
 * https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
 */
export class VisualDetector {
  _model: cocoSsd.ObjectDetection | null;
  _detectedRawObjects: cocoSsd.DetectedObject[];

  _$video: HTMLVideoElement | null;
  _requestAnimationFrameId: number;
  _magnification: { x: number; y: number };
  _stream: MediaStream | null;

  constructor() {
    this._model = null;
    this._$video = null;
    this._detectedRawObjects = [];
    this._requestAnimationFrameId = 0;
    /**
     * 設定されたvideo elementがtensorflow.jsの基準値（width: 640, height: 480）から、何倍かを保存する。
     */
    this._magnification = {
      x: 1,
      y: 1
    };
    this._stream = null;
  }

  get model() {
    return this._model;
  }

  get $video() {
    return this._$video;
  }

  get detectedRawObjects() {
    return this._detectedRawObjects;
  }

  get detectedObjects(): DetectedObject[] {

    return this.detectedRawObjects.map(obj => {
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
    })
  }

  get magnification() {
    return this._magnification;
  }

  get stream() {
    return this._stream;
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

  async load(
    elConfig?: LoadElProps,
    modelConfig: cocoSsd.ModelConfig = {}
  ): Promise<HTMLVideoElement> {
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

    const detectedRawObjects = await this.model.detect(this.$video);
    this._detectedRawObjects = detectedRawObjects;

    if(renderCallBack) {
      renderCallBack(this.detectedObjects);
    }
    
    this._requestAnimationFrameId = window.requestAnimationFrame(this.start.bind(this, renderCallBack));
  }

  stop() {
    this.stopVideos();
    this.stopAudios();

    if(this._$video) {
      this._stream = null;
      this._$video.srcObject = null;
      this._$video = null;
    }
  }

  stopVideos() {
    this.stream?.getVideoTracks().forEach(videoStream => {
      videoStream.enabled = false;
      videoStream.stop();
    });
  }
  stopAudios() {
    this.stream?.getAudioTracks().forEach(audioStream => {
      audioStream.enabled = false;
      audioStream.stop();
    });
  }
}