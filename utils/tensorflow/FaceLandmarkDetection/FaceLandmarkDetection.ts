import { FaceLandmarker } from '@mediapipe/tasks-vision';

import { INITIAL_VIDEO_EL_HEIGHT, INITIAL_VIDEO_EL_WIDTH } from '../../Media';
import { Video } from '../../Media/Video';
import type { ElOption } from '../type';
import { getVisionFileset } from '../vision';

import { MODEL_ASSET_PATH } from './constants';
import type { Face, FaceKeypoint, RenderCallBack } from './type';

interface Params {
  navigator: Navigator;
  document: Document;
  window: Window & typeof globalThis;
}

const LEFT_EYE_INDICES = [33, 133, 160, 159, 158, 157, 173, 246];
const RIGHT_EYE_INDICES = [362, 263, 387, 386, 385, 384, 398, 466];
const LEFT_EYEBROW_INDICES = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
const RIGHT_EYEBROW_INDICES = [
  336, 296, 334, 293, 300, 285, 295, 282, 283, 276,
];
const LIPS_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317,
  14, 87, 178, 88, 95, 185, 40, 39, 37, 0, 267, 269, 270, 409, 415, 310, 311,
  312, 13, 82, 81, 42, 183, 78,
];
const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
  400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
  54, 103, 67, 109,
];

const buildNamedKeypoints = (keypoints: FaceKeypoint[]): FaceKeypoint[] => {
  const leftEye = new Set(LEFT_EYE_INDICES);
  const rightEye = new Set(RIGHT_EYE_INDICES);
  const leftEyebrow = new Set(LEFT_EYEBROW_INDICES);
  const rightEyebrow = new Set(RIGHT_EYEBROW_INDICES);
  const lips = new Set(LIPS_INDICES);
  const face = new Set(FACE_OVAL_INDICES);

  return keypoints.map((keypoint, index) => {
    if (leftEye.has(index)) return { ...keypoint, name: `leftEye_${index}` };
    if (rightEye.has(index)) return { ...keypoint, name: `rightEye_${index}` };
    if (leftEyebrow.has(index)) {
      return { ...keypoint, name: `leftEyebrow_${index}` };
    }
    if (rightEyebrow.has(index)) {
      return { ...keypoint, name: `rightEyebrow_${index}` };
    }
    if (lips.has(index)) return { ...keypoint, name: `lips_${index}` };
    if (face.has(index)) return { ...keypoint, name: `face_${index}` };
    return keypoint;
  });
};

const createAnnotations = (
  keypoints: FaceKeypoint[],
): Record<string, [number, number, number][]> => {
  const pick = (indices: number[]): [number, number, number][] => {
    return indices
      .map((index) => keypoints[index])
      .filter((point): point is FaceKeypoint => Boolean(point))
      .map((point) => [point.x, point.y, point.z]);
  };

  return {
    leftEye: pick(LEFT_EYE_INDICES),
    rightEye: pick(RIGHT_EYE_INDICES),
    leftEyebrow: pick(LEFT_EYEBROW_INDICES),
    rightEyebrow: pick(RIGHT_EYEBROW_INDICES),
    lips: pick(LIPS_INDICES),
    faceOval: pick(FACE_OVAL_INDICES),
  };
};

export class FaceLandmarkDetection extends Video {
  _model: string;
  _detector: FaceLandmarker | null;
  _detectedRawFaces: Face[];
  _requestAnimationFrameId: number;
  _isRunning: boolean;

  private document: Document;
  private window: Window & typeof globalThis;

  constructor(params: Params) {
    super(params);
    this.document = params.document;
    this.window = params.window;
    this._model = 'MediaPipeFaceMesh';
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
      const fileset = await getVisionFileset();
      this._detector = await FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_ASSET_PATH,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });
    } catch (error) {
      console.error('モデル読み込みエラー:', error);
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
    const videoWidth = video.videoWidth || video.width;
    const videoHeight = video.videoHeight || video.height;
    const result = this.detector.detectForVideo(video, performance.now());
    const detectedFaces: Face[] = result.faceLandmarks.map((landmarks) => {
      const pixelKeypoints = landmarks.map((landmark) => ({
        x: landmark.x * videoWidth,
        y: landmark.y * videoHeight,
        z: landmark.z,
      }));
      const keypoints = buildNamedKeypoints(pixelKeypoints);

      const xs = keypoints.map((keypoint) => keypoint.x);
      const ys = keypoints.map((keypoint) => keypoint.y);
      const xMin = Math.min(...xs);
      const xMax = Math.max(...xs);
      const yMin = Math.min(...ys);
      const yMax = Math.max(...ys);

      return {
        box: {
          xMin,
          yMin,
          xMax,
          yMax,
          width: xMax - xMin,
          height: yMax - yMin,
        },
        keypoints,
        annotations: createAnnotations(keypoints),
      };
    });

    this._detectedRawFaces = detectedFaces;

    renderCallBack?.(this.detectedRawFaces);

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
