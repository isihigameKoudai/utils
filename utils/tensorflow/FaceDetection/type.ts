export type Face = {
  box: {
    width: number;
    height: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
  keypoints: {
    x: number;
    y: number;
    name?: string;
  }[];
};

export type RenderCallBack = (faces: Face[]) => void | Promise<void>;
