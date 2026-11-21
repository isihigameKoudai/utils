import type { Pose } from '@utils/modules/tensorflow/PoseDetection';

export interface PoseDetectionViewProps {
	width?: number;
	height?: number;
	poses: Pose[];
}
