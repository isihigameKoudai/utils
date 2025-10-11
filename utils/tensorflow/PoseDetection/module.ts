import * as poseDetection from '@tensorflow-models/pose-detection';

import { ModelType } from './type';

export const createConfig = (modelType: ModelType) => {
  const configMap = new Map<ModelType, Record<string, unknown>>([
    [
      poseDetection.SupportedModels.MoveNet,
      {
        runtime: 'tfjs',
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      },
    ],
    [
      poseDetection.SupportedModels.BlazePose,
      {
        runtime: 'tfjs',
        modelType: 'full',
      },
    ],
    [
      poseDetection.SupportedModels.PoseNet,
      {
        architecture: 'ResNet50',
        outputStride: 16,
        inputResolution: { width: 257, height: 200 },
        quantBytes: 4,
      },
    ],
  ]);

  if (!configMap.has(modelType)) {
    throw new Error(`Invalid model type: ${modelType}`);
  }

  return configMap.get(modelType)!;
};
