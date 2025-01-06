import * as poseDetection from '@tensorflow-models/pose-detection';

export type RenderCallBack = (poses: poseDetection.Pose[]) => void | Promise<void>;
