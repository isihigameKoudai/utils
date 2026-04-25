import { FilesetResolver } from '@mediapipe/tasks-vision';

const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

let visionFileset: WasmFileset | null = null;

type WasmFileset = Awaited<ReturnType<typeof FilesetResolver.forVisionTasks>>;

/**
 * MediaPipe VisionのFilesetResolverを取得する
 * @returns FilesetResolver
 */
export const getVisionFileset = async (): Promise<WasmFileset> => {
  if (visionFileset) return visionFileset;
  visionFileset = await FilesetResolver.forVisionTasks(WASM_PATH);
  return visionFileset;
};
