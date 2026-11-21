import type { Hand as HandPose } from '@utils/modules/tensorflow/HandPoseDetection/type';

export type Hand = HandPose;

export type HandPoseDetectionViewProps = {
	width?: number;
	height?: number;
	hands: Hand[];
};
