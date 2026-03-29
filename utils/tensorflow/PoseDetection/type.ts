export type Keypoint = {
  x: number;
  y: number;
  score?: number;
  name?: string;
};

export type Pose = {
  keypoints: Keypoint[];
  score: number;
};

export type ModelType = 'MoveNet' | 'BlazePose' | 'PoseNet';

export type RenderCallBack = (poses: Pose[]) => void | Promise<void>;
