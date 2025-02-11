import * as poseDetection from '@tensorflow-models/pose-detection';

export type Pose = poseDetection.Pose;

export type ModelType = keyof typeof poseDetection.SupportedModels;

export type RenderCallBack = (poses: Pose[]) => void | Promise<void>;
