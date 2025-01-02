/**
 * npm i @tensorflow/tfjs @tensorflow-models/hand-pose-detection
 */
import '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

import { Video } from '../../Media/Video';
import { INITIAL_VIDEO_EL_HEIGHT, INITIAL_VIDEO_EL_WIDTH } from '../../Media';

// TODO: 共通化
type LoadElProps = {
  $video?: HTMLVideoElement;
  width?: HTMLVideoElement['width'];
  height?: HTMLVideoElement['height'];
};

type RenderCallBack = (
  hands: handPoseDetection.Hand[]
) => void | Promise<void>;

export class HandPoseDetection extends Video {
  private _model: handPoseDetection.SupportedModels;
  private _detector: handPoseDetection.HandDetector | null = null;
  private _detectedRawHands: handPoseDetection.Hand[] = [];
  private _requestAnimationFrameId: number = 0;

  constructor() {
    super();
    this._model = handPoseDetection.SupportedModels.MediaPipeHands;
    this._detector = null;
    this._detectedRawHands = [];
    this._requestAnimationFrameId = 0;
  }

  get model() {
    return this._model;
  }

  get detector() {
    return this._detector;
  } 

  get detectedRawHands() {
    return this._detectedRawHands;
  } 

  get requestAnimationFrameId() {
    return this._requestAnimationFrameId;
  }

  async loadModel() {
    try {
      const detector = await handPoseDetection.createDetector(this._model, {
        runtime: 'tfjs',
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
  }: LoadElProps): Promise<HTMLVideoElement> {
    await this.getVideoStream();
    this.setMagnification({ x: width / INITIAL_VIDEO_EL_WIDTH, y: height / INITIAL_VIDEO_EL_HEIGHT });

    const videoEl = $video || document.createElement('video');
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.width = width;
    videoEl.height = height;
    this.setVideo(videoEl);
    return videoEl;
  }

  async load(elConfig?: LoadElProps) {
    await this.loadEl(elConfig || {});
    await this.loadModel();
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

    const hands = await this.detector.estimateHands(this.$video, {
      flipHorizontal: false
    });

    this._detectedRawHands = hands;

    renderCallBack?.(this.detectedRawHands);

    this._requestAnimationFrameId = window.requestAnimationFrame(this.start.bind(this, renderCallBack));
  }

  stop() {
    this.stopVideo();
    window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedRawHands = [];
    this._requestAnimationFrameId = 0;
    this._detector = null;
  }
}
