export type FaceKeypoint = {
  x: number;
  y: number;
  z: number;
  name?: string;
};

export type Face = {
  box: {
    width: number;
    height: number;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
  keypoints: FaceKeypoint[];
  annotations: Record<string, [number, number, number][]>;
};

export type RenderCallBack = (faces: Face[]) => void | Promise<void>;
