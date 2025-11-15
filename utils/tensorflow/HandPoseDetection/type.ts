import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export type RenderCallBack = (
  hands: handPoseDetection.Hand[],
) => void | Promise<void>;
