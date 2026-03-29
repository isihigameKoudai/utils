import { FaceDetector } from '@mediapipe/tasks-vision';

import {
  INITIAL_VIDEO_EL_WIDTH,
  INITIAL_VIDEO_EL_HEIGHT,
} from '../../Media/constants';
import { Video } from '../../Media/Video';
import { FACE_KEYPOINT_NAMES } from '../landmarks';
import type { ElOption } from '../type';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import type { Face, RenderCallBack } from './type';

interface Params {
  navigator: Navigator;
  document: Document;
  window: Window & typeof globalThis;
}

export class FaceDetection extends Video {
  _model: string;

  _detector: FaceDetector | null;

  _detectedRawFaces: Face[];

  _requestAnimationFrameId: number;

  private document: Document;
  private window: Window & typeof globalThis;

  constructor(params: Params) {
    super(params);
    this.document = params.document;
    this.window = params.window;
    this._model = 'MediaPipeFaceDetector';
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

  get detectedFaces(): Face[] {
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
      const fileset = await getVisionFileset();
      const detector = await FaceDetector.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_PATH,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
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
    const videoWidth = video.videoWidth || video.width;
    const videoHeight = video.videoHeight || video.height;
    const result = this.detector.detectForVideo(video, performance.now());
    const faces: Face[] = result.detections.map((detection) => {
      const box = detection.boundingBox;
      const x = box?.originX ?? 0;
      const y = box?.originY ?? 0;
      const width = box?.width ?? 0;
      const height = box?.height ?? 0;

      return {
        box: {
          xMin: x,
          yMin: y,
          xMax: x + width,
          yMax: y + height,
          width,
          height,
        },
        keypoints: detection.keypoints.map((keypoint, index) => ({
          x: keypoint.x * videoWidth,
          y: keypoint.y * videoHeight,
          name: FACE_KEYPOINT_NAMES[index],
        })),
      };
    });

    this._detectedRawFaces = faces;

    renderCallBack?.(this.detectedFaces);

    this._requestAnimationFrameId = this.window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    this.window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedRawFaces = [];
    this._requestAnimationFrameId = 0;
    this._detector = null;
  }
}
