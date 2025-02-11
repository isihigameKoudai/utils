import * as faceDetection from '@tensorflow-models/face-detection';

export type RenderCallBack = (
  faces: faceDetection.Face[]
) => void | Promise<void>;
