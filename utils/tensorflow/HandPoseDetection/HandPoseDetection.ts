import { HandLandmarker } from '@mediapipe/tasks-vision';

import {
  INITIAL_VIDEO_EL_HEIGHT,
  INITIAL_VIDEO_EL_WIDTH,
  Video,
} from '../../Media';
import { HAND_LANDMARK_NAMES } from '../landmarks';
import type { ElOption } from '../type';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import type { Hand, RenderCallBack } from './type';

const toHandedness = (categoryName?: string): Hand['handedness'] => {
  return categoryName === 'Left' ? 'Left' : 'Right';
};

interface Params {
  navigator: Navigator;
  document: Document;
  window: Window & typeof globalThis;
}

export class HandPoseDetection extends Video {
  private _model: string;
  private _detector: HandLandmarker | null = null;
  private _detectedRawHands: Hand[] = [];
  private _requestAnimationFrameId: number = 0;

  private document: Document;
  private window: Window & typeof globalThis;

  constructor(params: Params) {
    super(params);
    this.document = params.document;
    this.window = params.window;
    this._model = 'MediaPipeHands';
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
      const fileset = await getVisionFileset();
      const detector = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_PATH,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });
      this._detector = detector;
    } catch (error) {
      console.error(error);
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

    const video = this.$video;
    const result = this.detector.detectForVideo(video, performance.now());
    const videoWidth = video.videoWidth || video.width;
    const videoHeight = video.videoHeight || video.height;

    const hands: Hand[] = result.landmarks.map((handLandmarks, handIndex) => {
      const handedness = result.handedness[handIndex]?.[0];

      return {
        keypoints: handLandmarks.map((landmark, landmarkIndex) => ({
          x: landmark.x * videoWidth,
          y: landmark.y * videoHeight,
          name:
            HAND_LANDMARK_NAMES[landmarkIndex] ?? `landmark_${landmarkIndex}`,
        })),
        handedness: toHandedness(handedness?.categoryName),
        score: handedness?.score ?? 0,
      };
    });

    this._detectedRawHands = hands;

    renderCallBack?.(this.detectedRawHands);

    this._requestAnimationFrameId = this.window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    this.window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedRawHands = [];
    this._requestAnimationFrameId = 0;
    this._detector = null;
  }
}
