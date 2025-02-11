import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

export type RenderCallBack = (
  faces: faceLandmarksDetection.Face[]
) => void | Promise<void>;
