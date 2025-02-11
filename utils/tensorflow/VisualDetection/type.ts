import * as cocoSsd from '@tensorflow-models/coco-ssd';

export type DetectedObject = {
  class: cocoSsd.DetectedObject['class'];
  left: cocoSsd.DetectedObject['bbox'][0];
  top: cocoSsd.DetectedObject['bbox'][1];
  width: cocoSsd.DetectedObject['bbox'][2];
  height: cocoSsd.DetectedObject['bbox'][3];
  center: {
    x: number;
    y: number;
  };
  score: cocoSsd.DetectedObject['score'];
}
export type RenderCallBack = (objects: DetectedObject[]) => void | Promise<void>;
