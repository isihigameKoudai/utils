/**
 * npm install @tensorflow/tfjs @tensorflow-models/pose-detection
 */
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

import {
  Video,
  INITIAL_VIDEO_EL_WIDTH,
  INITIAL_VIDEO_EL_HEIGHT,
} from '../../Media';
import type { ElOption } from '../type';
import type { ModelType, RenderCallBack, Pose } from './type';
import { createConfig } from './module';

export class PoseDetection extends Video {
  private _model: poseDetection.SupportedModels;
  private _detector: poseDetection.PoseDetector | null;
  private _detectedPoses: Pose[];
  private _requestAnimationFrameId: number;

  constructor(modelType: ModelType = poseDetection.SupportedModels.MoveNet) {
    super();
    this._model = poseDetection.SupportedModels[modelType];
    this._detector = null;
    this._detectedPoses = [];
    this._requestAnimationFrameId = 0;
  }

  get detector() {
    return this._detector;
  }

  get detectedPoses() {
    return this._detectedPoses;
  }

  get model() {
    return this._model;
  }

  get requestAnimationFrameId() {
    return this._requestAnimationFrameId;
  }

  async loadDetector() {
    try {
      // NOTE: tensorflowのバックエンドを準備してからdetectorを作成する
      await tf.ready();

      const config = createConfig(this.model);
      this._detector = await poseDetection.createDetector(this.model, config);
      return this.detector;
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

  async load(elConfig?: ElOption) {
    await this.loadEl(elConfig || {});
    await this.loadDetector();
  }

  async start(renderCallBack?: RenderCallBack) {
    if (!this.detector) {
      console.error('detector is empty. you should load detector');
      return;
    }

    if (!this.$video) {
      console.error('$video is empty.');
      return;
    }

    const poses = await this.detector.estimatePoses(this.$video);
    this._detectedPoses = poses;

    if (renderCallBack) {
      renderCallBack(poses);
    }

    this._requestAnimationFrameId = window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedPoses = [];
    this._requestAnimationFrameId = 0;
    this._detector = null;
  }
}
