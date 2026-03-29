# @tensorflow-models/* → @mediapipe/tasks-vision 移行メモ

## 実施日: 2026-03-28

## 座標系の違い（最重要）
- 旧: ピクセル座標をそのまま返す
- 新: ランドマーク/キーポイントは**正規化座標(0.0〜1.0)**、ただし**FaceDetectorのboundingBoxだけはピクセル座標**
- 各モジュールのstart()内で `landmark.x * videoWidth` 変換し、消費者側には常にピクセル座標を返す

## バージョン固定
- `@mediapipe/tasks-vision@0.10.14` にピン留め
- 0.10.33以降はTypeScript型定義が壊れている（GitHub issue #6254）
- バージョンアップ時は必ず型チェック確認

## ランドマーク名マッピング
- 新ライブラリはインデックスのみ返す（name無し）
- `utils/tensorflow/landmarks.ts` に名前配列定義:
  - POSE_LANDMARK_NAMES[33], HAND_LANDMARK_NAMES[21], FACE_KEYPOINT_NAMES[6]
- `drawPose.ts` が `kp.name === 'left_shoulder'` 等でname検索するため、配列の正確性が重要

## vite.config.ts
- 旧: `mediapipeEsmPlugin()`（76行のIIFEラッパー）が必要だった
- 新: `optimizeDeps.exclude: ['@mediapipe/tasks-vision']` のみで動作（ESMバンドル）

## ビルドサイズ
- Before: 3.5M dist, 3,627KB main chunk (1,004KB gzip)
- After: 1.9M dist, 1,939KB main chunk (560KB gzip)
- **-46%** 削減（主因: @tensorflow/tfjs系6pkg + @tensorflow-models/*系5pkg → 1pkgに集約）

## FaceLandmarkDetection の annotations
- 旧ライブラリは face.annotations を直接返していた
- 新ライブラリにはその概念なし → MediaPipeの468ランドマークインデックスからパーツ別グループを手動構築
- LEFT_EYE_INDICES, LIPS_INDICES 等の定数が `FaceLandmarkDetection.ts` 内に定義済み

## FilesetResolver シングルトン
- `utils/tensorflow/vision.ts` の `getVisionFileset()` がWASM初期化を1回キャッシュ
- 複数検出モジュール同時使用でもWASM初期化は1回

## 削除したパッケージ（10個）
@tensorflow/tfjs, @tensorflow/tfjs-core, @tensorflow/tfjs-backend-wasm, @tensorflow/tfjs-backend-webgl, @tensorflow/tfjs-backend-webgpu, @tensorflow-models/coco-ssd, @tensorflow-models/face-detection, @tensorflow-models/face-landmarks-detection, @tensorflow-models/hand-pose-detection, @tensorflow-models/pose-detection
