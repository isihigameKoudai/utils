import { Pose } from '../../../utils/tensorflow/PoseDetection';

export interface PoseDetectionViewProps {
  width?: number;
  height?: number;
  poses: Pose[];
}
