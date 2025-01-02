import { Hand as HandPose } from '@tensorflow-models/hand-pose-detection';

export type Hand = HandPose;

export type HandPoseDetectionViewProps = {
  width?: number;
  height?: number;
  hands: Hand[];
};
