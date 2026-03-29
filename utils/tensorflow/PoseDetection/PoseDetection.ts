import { PoseLandmarker } from '@mediapipe/tasks-vision';

import {
  INITIAL_VIDEO_EL_HEIGHT,
  INITIAL_VIDEO_EL_WIDTH,
  Video,
} from '../../Media';
import { POSE_LANDMARK_NAMES } from '../landmarks';
import type { ElOption } from '../type';
import { getVisionFileset } from '../vision';

import { getModelAssetPath } from './module';
import type { ModelType, Pose, RenderCallBack } from './type';

interface Params {
  navigator: Navigator;
  document: Document;
  window: Window & typeof globalThis;
}

export class PoseDetection extends Video {
  private _model: ModelType;
  private _detector: PoseLandmarker | null;
  private _detectedPoses: Pose[];
  private _requestAnimationFrameId: number;

  private document: Document;
  private window: Window & typeof globalThis;

  constructor(params: Params, modelType: ModelType = 'MoveNet') {
    super(params);
    this.document = params.document;
    this.window = params.window;
    this._model = modelType;
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
      const fileset = await getVisionFileset();
      this._detector = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: getModelAssetPath(this.model),
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
      return this.detector;
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

    const video = this.$video;
    const videoWidth = video.videoWidth || video.width;
    const videoHeight = video.videoHeight || video.height;
    const result = this.detector.detectForVideo(video, performance.now());
    const poses: Pose[] = result.landmarks.map((poseLandmarks) => {
      const keypoints = poseLandmarks.map((landmark, index) => ({
        x: landmark.x * videoWidth,
        y: landmark.y * videoHeight,
        score: landmark.visibility ?? 0,
        name: POSE_LANDMARK_NAMES[index] ?? `landmark_${index}`,
      }));
      const total = keypoints.reduce((sum, keypoint) => {
        return sum + (keypoint.score ?? 0);
      }, 0);

      return {
        keypoints,
        score: keypoints.length > 0 ? total / keypoints.length : 0,
      };
    });

    this._detectedPoses = poses;

    if (renderCallBack) {
      renderCallBack(poses);
    }

    this._requestAnimationFrameId = this.window.requestAnimationFrame(
      this.start.bind(this, renderCallBack),
    );
  }

  stop() {
    this.stopVideo();
    this.window.cancelAnimationFrame(this._requestAnimationFrameId);
    this._detectedPoses = [];
    this._requestAnimationFrameId = 0;
    this._detector = null;
  }
}
