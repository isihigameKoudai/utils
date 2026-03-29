# Migration Plan: @tensorflow-models/\* → @mediapipe/tasks-vision

## Overview

Replace all 5 detection modules in `utils/tensorflow/` from `@tensorflow-models/*` to `@mediapipe/tasks-vision`.
Clean up vite.config.ts workarounds and remove 10 obsolete npm packages.
Verify via build size comparison + visual screen testing.

## Critical Risk: Coordinate System Mismatch

| Aspect            | Old (@tensorflow-models)                     | New (@mediapipe/tasks-vision)                   |
| ----------------- | -------------------------------------------- | ----------------------------------------------- |
| Coordinate format | **Pixel coordinates** (direct use)           | **Normalized (0.0–1.0)**                        |
| FaceDetection box | `{xMin, xMax, yMin, yMax, width, height}` px | `{originX, originY, width, height}` normalized  |
| Hand keypoints    | `{x, y, name}` px                            | `{x, y, z}` normalized, index-based (no name)   |
| Pose keypoints    | `{x, y, score, name}` px                     | `{x, y, z, visibility}` normalized, index-based |
| Object bbox       | `[left, top, width, height]` px              | `{originX, originY, width, height}` normalized  |

**Mitigation**: Each module's `start()` method must convert normalized → pixel coordinates (multiply by video.videoWidth/Height) BEFORE calling renderCallback, so all consumers see pixel coordinates as before.

## Consumer Impact Analysis

### Type re-exports that will break:

- `src/features/Detection/components/FaceMesh/type.ts` → imports `Face` from `@tensorflow-models/face-landmarks-detection`
- `src/features/Detection/components/HandPoseDetectionView/type.ts` → imports `Hand` from `@tensorflow-models/hand-pose-detection`
- `src/features/Detection/components/HandPoseDetectionView/drawHands.ts` → imports `Hand` from `@tensorflow-models/hand-pose-detection`

### Consumer data access patterns (MUST preserve):

- **FaceDetection**: `face.box.{xMin, yMin, width, height}`, `face.keypoints[].{x, y, name}`
- **HandPoseDetection**: `hand.keypoints[].{x, y}`, `hand.handedness` ("Left"/"Right"), `hand.score`
- **PoseDetection**: `pose.keypoints[].{x, y, score, name}` (name used for `.find()` lookups like 'left_shoulder')
- **FaceLandmarkDetection**: `face.keypoints[].{x, y, z}`, `face.box`, `face.annotations`
- **VisualDetection**: `obj.{left, top, width, height, class, score, center.{x, y}}`
- **Property access**: `detector.$video`, `detector._$video`, `detector.model`, `detector.magnification`

---

## Phase 0: Before Build Size Measurement

### Steps:

- [x] Run `npm run build` on current codebase
- [x] Record `dist/assets/*.js` chunk sizes (especially tensorflow/vendor chunks)
- [x] Record total `dist/` size via `du -sh dist/`

### Expected Output:

- Console log with chunk sizes
- Total dist size number for comparison

---

## Phase 1: Package Installation + Shared Utilities

### Step 1-1: [x] Install @mediapipe/tasks-vision

```bash
npm install @mediapipe/tasks-vision@0.10.14
```

Version 0.10.14 chosen for TypeScript type stability (0.10.33 has broken types per GitHub issue #6254).

### Step 1-2: [x] Create shared FilesetResolver singleton

**File**: `utils/tensorflow/vision.ts` (NEW)

```typescript
/**
 * Shared FilesetResolver singleton for @mediapipe/tasks-vision.
 * Ensures forVisionTasks() is called only once and cached.
 */
import { FilesetResolver } from '@mediapipe/tasks-vision';
import type { WasmFileset } from '@mediapipe/tasks-vision';

const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';

let visionFileset: WasmFileset | null = null;

export const getVisionFileset = async (): Promise<WasmFileset> => {
  if (visionFileset) return visionFileset;
  visionFileset = await FilesetResolver.forVisionTasks(WASM_PATH);
  return visionFileset;
};
```

### Step 1-3: [x] Create model asset path constants

**File**: `utils/tensorflow/models.ts` (NEW)

```typescript
/**
 * CDN URLs for MediaPipe Vision model assets (.task / .tflite files).
 */
export const MODEL_ASSET_PATHS = {
  FACE_DETECTOR:
    'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
  FACE_LANDMARKER:
    'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
  HAND_LANDMARKER:
    'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  POSE_LANDMARKER_LITE:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
  POSE_LANDMARKER_FULL:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
  POSE_LANDMARKER_HEAVY:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
  OBJECT_DETECTOR:
    'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite',
} as const;
```

### Step 1-4: [x] Create shared landmark name constants

**File**: `utils/tensorflow/landmarks.ts` (NEW)

- Add `POSE_LANDMARK_NAMES` (33)
- Add `FACE_KEYPOINT_NAMES` (6)
- Add `HAND_LANDMARK_NAMES` (21)

---

## Phase 2: Module Rewrites (5 modules)

### Common Pattern for All Modules

Each module keeps:

- Same class name, same constructor signature `{navigator, document, window}`
- Same `load(elConfig?)`, `start(renderCallBack?)`, `stop()` method signatures
- Same `loadEl()` behavior (video element creation, magnification calc)
- Same getter names and return types
- Video base class inheritance

Each module changes:

- `loadModel()` → uses `XxxDetector.createFromOptions(fileset, options)` with `runningMode: 'VIDEO'`
- `start()` → uses `detectForVideo(video, performance.now())` instead of `estimate*`
- Result mapping: normalized → pixel conversion + structure adaptation to match old format

### Step 2-1: [x] HandPoseDetection

**File**: `utils/tensorflow/HandPoseDetection/HandPoseDetection.ts`

Key changes:

- Import `HandLandmarker` from `@mediapipe/tasks-vision` instead of `@tensorflow-models/hand-pose-detection`
- Remove `import * as tf from '@tensorflow/tfjs'`
- `_detector` type → `HandLandmarker | null`
- `loadModel()`: Use `HandLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: 'GPU' }, runningMode: 'VIDEO', numHands: 2 })`
- `start()`: Call `detector.detectForVideo(video, performance.now())`
- Result mapping: Convert `HandLandmarkerResult.landmarks[][]` + `handedness[][]` → old `Hand[]` format:
  ```typescript
  // Old format: { keypoints: [{x, y, name}], handedness: 'Left', score: 0.98 }
  // New format: { landmarks: [[{x, y, z}]], handedness: [[{categoryName, score}]] }
  // Mapping:
  result.landmarks.map((handLandmarks, i) => ({
    keypoints: handLandmarks.map((lm, idx) => ({
      x: lm.x * video.videoWidth, // normalized → px
      y: lm.y * video.videoHeight,
      name: HAND_LANDMARK_NAMES[idx], // Need to define name mapping
    })),
    handedness: result.handedness[i][0].categoryName,
    score: result.handedness[i][0].score,
  }));
  ```

**File**: `utils/tensorflow/HandPoseDetection/type.ts`

- Remove `@tensorflow-models/hand-pose-detection` import
- Define `Hand` type locally:
  ```typescript
  export type Keypoint = { x: number; y: number; name?: string };
  export type Hand = {
    keypoints: Keypoint[];
    handedness: string;
    score: number;
  };
  export type RenderCallBack = (hands: Hand[]) => void | Promise<void>;
  ```

### Step 2-2: [x] FaceDetection

**File**: `utils/tensorflow/FaceDetection/FaceDetection.ts`

Key changes:

- Import `FaceDetector` from `@mediapipe/tasks-vision`
- `_detector` type → `FaceDetector | null`
- `loadModel()`: Use `FaceDetector.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: 'GPU' }, runningMode: 'VIDEO' })`
- `start()`: Call `detector.detectForVideo(video, performance.now())`
- Result mapping: Convert `FaceDetectorResult.detections[]` → old `Face[]` format:
  ```typescript
  // Old format: { box: {xMin, xMax, yMin, yMax, width, height}, keypoints: [{x, y, name}] }
  // New format: { detections: [{ boundingBox: {originX, originY, width, height}, keypoints: [{x, y}] }] }
  // Mapping:
  result.detections.map((d) => {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const x = d.boundingBox.originX * vw; // NOTE: check if already px or normalized
    const y = d.boundingBox.originY * vh;
    const w = d.boundingBox.width * vw;
    const h = d.boundingBox.height * vh;
    return {
      box: { xMin: x, yMin: y, xMax: x + w, yMax: y + h, width: w, height: h },
      keypoints: (d.keypoints || []).map((kp, idx) => ({
        x: kp.x * vw,
        y: kp.y * vh,
        name: FACE_KEYPOINT_NAMES[idx],
      })),
    };
  });
  ```

**IMPORTANT NOTE**: FaceDetector's boundingBox coordinates — need to verify at runtime whether `originX/originY` are normalized (0-1) or pixel-based. The librarian research says normalized, but some implementations show pixel-based. Will verify during implementation.

**File**: `utils/tensorflow/FaceDetection/type.ts`

- Remove `@tensorflow-models/face-detection` import
- Define `Face` type locally:
  ```typescript
  export type Face = {
    box: {
      width: number;
      height: number;
      xMin: number;
      xMax: number;
      yMin: number;
      yMax: number;
    };
    keypoints: { x: number; y: number; name?: string }[];
  };
  export type RenderCallBack = (faces: Face[]) => void | Promise<void>;
  ```

### Step 2-3: [x] FaceLandmarkDetection

**File**: `utils/tensorflow/FaceLandmarkDetection/FaceLandmarkDetection.ts`

Key changes:

- Import `FaceLandmarker` from `@mediapipe/tasks-vision`
- `_detector` type → `FaceLandmarker | null`
- `loadModel()`: Use `FaceLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: 'GPU' }, runningMode: 'VIDEO', numFaces: 1 })`
- `start()`: Call `detector.detectForVideo(video, performance.now())`
- Result mapping: Convert `FaceLandmarkerResult.faceLandmarks[][]` → old `Face[]` format:
  ```typescript
  // Old result: [{ box: {xMin, yMin, ...}, keypoints: [{x, y, z, name}] }]
  // New result: { faceLandmarks: [[{x, y, z}]] }
  // Mapping:
  result.faceLandmarks.map((landmarks) => {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const keypoints = landmarks.map((lm, idx) => ({
      x: lm.x * vw,
      y: lm.y * vh,
      z: lm.z,
      name: FACE_LANDMARK_NAMES[idx], // Optional: 468+ landmark names
    }));
    // Compute bounding box from all keypoints
    const xs = keypoints.map((k) => k.x);
    const ys = keypoints.map((k) => k.y);
    const xMin = Math.min(...xs),
      xMax = Math.max(...xs);
    const yMin = Math.min(...ys),
      yMax = Math.max(...ys);
    return {
      box: { xMin, yMin, xMax, yMax, width: xMax - xMin, height: yMax - yMin },
      keypoints,
    };
  });
  ```

**File**: `utils/tensorflow/FaceLandmarkDetection/type.ts`

- Remove `@tensorflow-models/face-landmarks-detection` import
- Define `Face` type locally

### Step 2-4: [x] PoseDetection

**File**: `utils/tensorflow/PoseDetection/PoseDetection.ts`

Key changes:

- Import `PoseLandmarker` from `@mediapipe/tasks-vision`
- `_detector` type → `PoseLandmarker | null`
- Constructor: Remove `modelType` parameter (PoseLandmarker uses .task file, not model enum). Use `pose_landmarker_lite.task` as default.
  - **Breaking change**: Old code passes `'BlazePose'` from PoseDetectionPage. Need to decide: always use lite, or map old model types to new .task files.
  - Decision: Map `MoveNet` → lite, `BlazePose` → full, `PoseNet` → lite (closest equivalent)
- `loadDetector()`: Use `PoseLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: 'GPU' }, runningMode: 'VIDEO', numPoses: 1 })`
- `start()`: Call `detector.detectForVideo(video, performance.now())`
- Result mapping: Convert `PoseLandmarkerResult.landmarks[][]` → old `Pose[]` format:
  ```typescript
  // Old: [{ keypoints: [{x, y, score, name}], score }]
  // New: { landmarks: [[{x, y, z, visibility}]] }
  // Mapping:
  result.landmarks.map((poseLandmarks) => ({
    keypoints: poseLandmarks.map((lm, idx) => ({
      x: lm.x * video.videoWidth,
      y: lm.y * video.videoHeight,
      score: lm.visibility ?? 0,
      name: POSE_LANDMARK_NAMES[idx], // 'nose', 'left_eye', 'left_shoulder', etc.
    })),
    score:
      poseLandmarks.reduce((sum, lm) => sum + (lm.visibility ?? 0), 0) /
      poseLandmarks.length,
  }));
  ```

**CRITICAL**: `drawPose.ts` uses `keypoint.find(kp => kp.name === 'left_shoulder')` etc. MUST define `POSE_LANDMARK_NAMES` array matching MediaPipe's 33 landmark indices to names.

**File**: `utils/tensorflow/PoseDetection/type.ts`

- Remove `@tensorflow-models/pose-detection` import
- Define locally:
  ```typescript
  export type Keypoint = {
    x: number;
    y: number;
    score?: number;
    name?: string;
  };
  export type Pose = { keypoints: Keypoint[]; score: number };
  export type ModelType = 'MoveNet' | 'BlazePose' | 'PoseNet';
  export type RenderCallBack = (poses: Pose[]) => void | Promise<void>;
  ```

**File**: `utils/tensorflow/PoseDetection/module.ts`

- Rewrite to map ModelType → model asset path:
  ```typescript
  export const getModelAssetPath = (modelType: ModelType): string => {
    const map = {
      MoveNet: MODEL_ASSET_PATHS.POSE_LANDMARKER_LITE,
      BlazePose: MODEL_ASSET_PATHS.POSE_LANDMARKER_FULL,
      PoseNet: MODEL_ASSET_PATHS.POSE_LANDMARKER_LITE,
    };
    return map[modelType] ?? MODEL_ASSET_PATHS.POSE_LANDMARKER_LITE;
  };
  ```

### Step 2-5: [x] VisualDetection

**File**: `utils/tensorflow/VisualDetection/VisualDetection.ts`

Key changes:

- Import `ObjectDetector` from `@mediapipe/tasks-vision`
- `_model` type → `ObjectDetector | null`
- `loadModel()`: Use `ObjectDetector.createFromOptions(fileset, { baseOptions: { modelAssetPath, delegate: 'GPU' }, runningMode: 'VIDEO', scoreThreshold: 0.3 })`
- `start()`: Call `model.detectForVideo(video, performance.now())`
- `_detectedRawObjects`: Store raw `Detection[]` from MediaPipe
- `detectedObjects` getter: Convert `Detection[]` → old `DetectedObject[]` format:
  ```typescript
  // Old raw: { bbox: [left, top, width, height], class, score }
  // New raw: { boundingBox: {originX, originY, width, height}, categories: [{categoryName, score}] }
  // Mapping in getter:
  this._detectedRawObjects.map((d) => {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const { timesX, timesY } = this.magnification;
    const left = d.boundingBox.originX * vw * timesX; // May need to check normalized vs px
    const top = d.boundingBox.originY * vh * timesY;
    const width = d.boundingBox.width * vw * timesX;
    const height = d.boundingBox.height * vh * timesY;
    return {
      left,
      top,
      width,
      height,
      class: d.categories[0]?.categoryName ?? '',
      score: d.categories[0]?.score ?? 0,
      center: { x: left + width / 2, y: top + height / 2 },
    };
  });
  ```

**Note on `_detectedRawObjects`**: The getter currently uses `cocoSsd.DetectedObject[]` for raw storage. After migration, raw type changes to MediaPipe's `Detection[]`. The public `detectedObjects` getter output type (`DetectedObject`) stays the same.

**File**: `utils/tensorflow/VisualDetection/type.ts`

- Remove `@tensorflow-models/coco-ssd` import
- `DetectedObject` type is already locally-defined shape (just referenced cocoSsd for field types), redefine with plain types:
  ```typescript
  export type DetectedObject = {
    class: string;
    left: number;
    top: number;
    width: number;
    height: number;
    center: { x: number; y: number };
    score: number;
  };
  ```

---

## Phase 3: Consumer-side Type Fixes

### Step 3-1: [x] Fix FaceMesh type.ts

**File**: `src/features/Detection/components/FaceMesh/type.ts`

- Change from `import type { Face } from '@tensorflow-models/face-landmarks-detection'`
- To: `import type { Face } from '@/utils/tensorflow/FaceLandmarkDetection/type'`

### Step 3-2: [x] Fix HandPoseDetectionView types

**File**: `src/features/Detection/components/HandPoseDetectionView/type.ts`

- Change from `import type { Hand as HandPose } from '@tensorflow-models/hand-pose-detection'`
- To: `import type { Hand as HandPose } from '@/utils/tensorflow/HandPoseDetection/type'`

**File**: `src/features/Detection/components/HandPoseDetectionView/drawHands.ts`

- Change from `import type { Hand } from '@tensorflow-models/hand-pose-detection'`
- To: `import type { Hand } from '@/utils/tensorflow/HandPoseDetection/type'`

---

## Phase 4: Test Rewrites + Cleanup

### Step 4-1: [x] Rewrite test mocks for all 5 modules

Each test file needs:

- Replace `vi.mock('@tensorflow-models/xxx')` → `vi.mock('@mediapipe/tasks-vision')`
- Replace mock detector methods (estimateFaces → detectForVideo, etc.)
- Mock return values should use new MediaPipe result format
- Keep test assertions the same (verify same public API contract)

For PoseDetection test:

- Also remove `vi.mock('@tensorflow/tfjs')` since tf.ready() is no longer called

### Step 4-2: [x] Remove old packages

```bash
npm uninstall @tensorflow/tfjs @tensorflow/tfjs-core @tensorflow/tfjs-backend-wasm @tensorflow/tfjs-backend-webgl @tensorflow/tfjs-backend-webgpu
npm uninstall @tensorflow-models/coco-ssd @tensorflow-models/face-detection @tensorflow-models/face-landmarks-detection @tensorflow-models/hand-pose-detection @tensorflow-models/pose-detection
```

### Step 4-3: [x] Clean vite.config.ts

- Remove `mediapipeEsmPlugin()` function (lines 15-76)
- Remove `mediapipeEsmPlugin()` from plugins array
- Remove `optimizeDeps.exclude` entries for `@mediapipe/*`
- Add `optimizeDeps.exclude: ['@mediapipe/tasks-vision']` (per librarian recommendation for Vite ESM handling)
- Remove unused imports: `fs`

### Step 4-4: [x] Run tests + build

```bash
npx vitest run
npm run build
```

---

## Phase 5: After Build Size Measurement + Visual Verification

### Step 5-1: [x] Measure after build size

```bash
npm run build
du -sh dist/
```

### Step 5-2: [x] Compare before/after

Calculate size reduction percentage.

### Step 5-3: [ ] Visual screen verification

Open dev server and navigate to each detection feature page:

- `/detection` (VisualDetection - DetectorPage)
- `/detection/hand-pose` (HandPoseDetection)
- `/detection/pose` (PoseDetection)
- `/detection/face-landmark` (FaceLandmarkDetection)
- FaceDetection component (used in FaceDetectionView.tsx)
- MeltTheBorder page (uses VisualDetection)

Verify: Detection runs, coordinates display correctly, no console errors.

---

## Landmark Name Mappings (Required Constants)

### POSE_LANDMARK_NAMES (33 landmarks - MediaPipe PoseLandmarker)

```typescript
const POSE_LANDMARK_NAMES = [
  'nose',
  'left_eye_inner',
  'left_eye',
  'left_eye_outer',
  'right_eye_inner',
  'right_eye',
  'right_eye_outer',
  'left_ear',
  'right_ear',
  'mouth_left',
  'mouth_right',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_pinky',
  'right_pinky',
  'left_index',
  'right_index',
  'left_thumb',
  'right_thumb',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
  'left_heel',
  'right_heel',
  'left_foot_index',
  'right_foot_index',
];
```

### FACE_KEYPOINT_NAMES (6 keypoints - MediaPipe FaceDetector)

```typescript
const FACE_KEYPOINT_NAMES = [
  'rightEye',
  'leftEye',
  'noseTip',
  'mouthCenter',
  'rightEarTragion',
  'leftEarTragion',
];
```

### HAND_LANDMARK_NAMES (21 landmarks - MediaPipe HandLandmarker)

```typescript
const HAND_LANDMARK_NAMES = [
  'wrist',
  'thumb_cmc',
  'thumb_mcp',
  'thumb_ip',
  'thumb_tip',
  'index_finger_mcp',
  'index_finger_pip',
  'index_finger_dip',
  'index_finger_tip',
  'middle_finger_mcp',
  'middle_finger_pip',
  'middle_finger_dip',
  'middle_finger_tip',
  'ring_finger_mcp',
  'ring_finger_pip',
  'ring_finger_dip',
  'ring_finger_tip',
  'pinky_finger_mcp',
  'pinky_finger_pip',
  'pinky_finger_dip',
  'pinky_finger_tip',
];
```

---

## Risk Register

| Risk                                                        | Impact                    | Mitigation                                                              |
| ----------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------- |
| Normalized vs pixel coordinate confusion                    | High (broken rendering)   | Always convert at module boundary, never expose normalized to consumers |
| FaceDetector boundingBox format uncertainty                 | Medium                    | Verify at runtime, add logging during dev                               |
| Landmark name mismatch (old vs new)                         | High (drawPose.ts breaks) | Define explicit POSE_LANDMARK_NAMES mapping array                       |
| @mediapipe/tasks-vision TypeScript types broken at >0.10.14 | Medium                    | Pin to 0.10.14                                                          |
| Model loading latency (CDN fetch)                           | Low (same as before)      | FilesetResolver singleton caches WASM                                   |
| GPU delegate failure on some browsers                       | Low                       | Could add CPU fallback, but old code didn't have it either              |
