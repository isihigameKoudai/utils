import * as faceDetection from '@tensorflow-models/face-detection';

export type LoadElProps = {
  $video?: HTMLVideoElement;
  width?: HTMLVideoElement['width'];
  height?: HTMLVideoElement['height'];
};

export type RenderCallBack = (
  faces: faceDetection.Face[]
) => void | Promise<void>;
