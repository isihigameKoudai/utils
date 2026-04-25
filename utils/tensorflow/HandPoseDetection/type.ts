export type Keypoint = {
  x: number;
  y: number;
  name?: string;
};

export type Hand = {
  keypoints: Keypoint[];
  handedness: 'Left' | 'Right';
  score: number;
};

export type RenderCallBack = (hands: Hand[]) => void | Promise<void>;
