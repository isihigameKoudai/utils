export type DetectedObject = {
  class: string;
  left: number;
  top: number;
  width: number;
  height: number;
  center: {
    x: number;
    y: number;
  };
  score: number;
};

export type ModelConfig = {
  scoreThreshold?: number;
};

export type RenderCallBack = (
  objects: DetectedObject[],
) => void | Promise<void>;
