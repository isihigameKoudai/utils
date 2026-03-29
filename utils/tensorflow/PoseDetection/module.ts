import {
  POSE_LANDMARKER_FULL_PATH,
  POSE_LANDMARKER_LITE_PATH,
} from './constants';
import type { ModelType } from './type';

export const getModelAssetPath = (modelType: ModelType): string => {
  const modelAssetPathMap: Record<ModelType, string> = {
    MoveNet: POSE_LANDMARKER_LITE_PATH,
    BlazePose: POSE_LANDMARKER_FULL_PATH,
    PoseNet: POSE_LANDMARKER_LITE_PATH,
  };

  return modelAssetPathMap[modelType] ?? POSE_LANDMARKER_LITE_PATH;
};
