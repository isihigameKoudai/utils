import { Pose } from '../../../packages/tensorflow/PoseDetection';

export interface PoseDetectionViewProps {
  width?: number;
  height?: number;
  poses: Pose[];
}
