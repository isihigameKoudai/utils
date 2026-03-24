# `@tensorflow-models/*` から `@mediapipe/tasks-vision` への移行計画

## 背景・目的
現在、本プロジェクトの `utils/tensorflow/*` に実装されている画像・動画認識ロジックは `@tensorflow-models` 系のライブラリに依存している。
しかし、内部で使用されている `@mediapipe` 系の古いパッケージ（IIFE形式）が由来で、Vite 8（Rolldown）等の最新モジュールハンドラでビルドエラーを引き起こす問題がある。
現在 `vite.config.ts` のカスタムプラグインで回避しているが、よりモダン・高速・ESM対応の **`@mediapipe/tasks-vision`** へ完全に移行することで、依存関係を整理し、最新の WebAssembly/WebGPU の恩恵を受けることを目的とする。

## 目標
1. `utils/tensorflow` 配下の5つの検出モジュールを、すべて `@mediapipe/tasks-vision` を用いて書き換える。
2. 古い TensorFlow.js および MediaPipe の依存パッケージ（`package.json`）をすべて削除する。
3. `vite.config.ts` で行なっている IIFE 用の無茶なワークアラウンド（`mediapipeEsmPlugin` や `optimizeDeps.exclude`）を削除する。
4. **ViteのビルドによるバンドルサイズのBefore/Afterを計測・比較し、どの程度軽量化されるかを検証する。**

## ターゲットモジュールと代替クラスのマッピング
| 現在のディレクトリ (`utils/tensorflow/*`) | 現在使用されているパッケージ | 移行先のクラス (`@mediapipe/tasks-vision`) |
| :--- | :--- | :--- |
| `FaceDetection` | `@tensorflow-models/face-detection` | `FaceDetector` |
| `FaceLandmarkDetection` | `@tensorflow-models/face-landmarks-detection` | `FaceLandmarker` |
| `HandPoseDetection` | `@tensorflow-models/hand-pose-detection` | `HandLandmarker` |
| `PoseDetection` | `@tensorflow-models/pose-detection` | `PoseLandmarker` |
| `VisualDetection` | `@tensorflow-models/coco-ssd` | `ObjectDetector` |

## マイルストーン（段階的移行）

### 移行フェーズ 0: バンドルサイズの計測 (Before)
移行作業を開始する前に、現在の TensorFlow.js ベースの実装が本番バンドルサイズに与えている影響を測定し記録する。
1. 現在の main ブランチ（移行前）で `npm run build` を実行する。
2. コンソールに出力される `dist/assets/*.js` の各チャンクサイズ（特に vendor や tensorflow 関連を含む大きなチャンク）を記録する。
   （※Vite 8 の Rolldown 環境下では、従来の `rollup-plugin-visualizer` が完全動作しない可能性があるため、まずは標準のビルドログ出力や `ls -lh dist/assets` 等で全体サイズを比較することを推奨する）

### 移行フェーズ 1: パッケージの導入と共通処理の作成
1. `npm install @mediapipe/tasks-vision` を実行。
2. 内部クラス (`utils/tensorflow/`) が呼び出すタスクロード用の共通ユーティリティ関数を作成。
   - 例: `FilesetResolver.forVisionTasks` を一度だけ呼び出してキャッシュするシングルトン機構など。
3. 各モデル読み込み時の `modelAssetPath`（タスクファイルURL）を定数管理する。

### 移行フェーズ 2: クラスの書き換え（機能ごと）
各クラスは現在 `Video` ベースクラスを継承しており、`load` と `start` メソッドで構成されている。呼び出し元（インターフェース）は極力維持し、内部の実装のみをすげ替える。

*   **Step 2-1: `HandPoseDetection` の移行**
    *   `_model` を `HandLandmarker` インスタンスに変更。
    *   `loadModel` メソッドにて `HandLandmarker.createFromOptions` を呼び出す。
    *   `start` メソッドにて、`detectForVideo` を用いて結果を取得し、コールバックへ渡す。
*   **Step 2-2: `FaceDetection` の移行**
    *   `FaceDetector.createFromOptions` と `detectForVideo` を使用。
*   **Step 2-3: `FaceLandmarkDetection` の移行**
    *   `FaceLandmarker.createFromOptions` と `detectForVideo` を使用。
*   **Step 2-4: `PoseDetection` の移行**
    *   `PoseLandmarker.createFromOptions` と `detectForVideo` を使用。
*   **Step 2-5: `VisualDetection` の移行**
    *   `ObjectDetector.createFromOptions` と `detectForVideo` を使用。

### 移行フェーズ 3: データ構造のマッピングと調整
`detectForVideo` から返る座標データの形式（Landmark / BoundingBox）が従来の TensorFlow 形式と異なる場合があるため、各クラスの getter（`detectedFaces`, `detectedObjects` 等）内部で、従来の出力形式に合わせてマッピング（正規化）を行う。
画面の拡大率（`magnification`）のかけ方に注意。

### 移行フェーズ 4: テストの実行とクリーンアップ
1. 各検出機能を描画している React コンポーネントおよびテスト（例：`FaceDetection.test.ts`等がある場合）を実行し、正しく座標がバインドされているか確認。
2. 動作確認完了後、不要になったパッケージを削除。
   ```bash
   npm uninstall @tensorflow/tfjs @tensorflow/tfjs-core @tensorflow/tfjs-backend-wasm @tensorflow/tfjs-backend-webgl @tensorflow/tfjs-backend-webgpu
   npm uninstall @tensorflow-models/coco-ssd @tensorflow-models/face-detection @tensorflow-models/face-landmarks-detection @tensorflow-models/hand-pose-detection @tensorflow-models/pose-detection
   ```
3. `vite.config.ts` をクリーンアップ。
   - `mediapipeEsmPlugin` の削除。
   - `optimizeDeps.exclude` から `@mediapipe/*` のエントリを削除。

### 移行フェーズ 5: バンドルサイズの検証と報告 (After)
移行作業と不要パッケージ削除が完全に終わった後、再度ビルドを行ってサイズの激減を確認する。
1. `npm run build` を再度実行し、`dist/assets/*.js` の総サイズを測定する。
2. **Before** と **After** のサイズ差異を計算し、`@mediapipe/tasks-vision` （WebAssembly 主体）へ移行したことによる軽量化率をレポートとして提供する。

## メモ / 注意事項
*   **パッケージサイズの検証**: Vite 8 (Rolldown) 環境では、従来の Rollup 用プラグインの互換性が完全ではない可能性があるため、単純に標準のコンソール出力での容量比較か、出力ディレクトリの総容量比較でも十分に強力な指標となる。
*   **モデルファイル配信**: 新しい API ではモデル構成ファイル (`.task` ファイル) を URL 経由で読み込む必要がある。CDN から最新版を読み込むか、静的アセット（`public/`）に配置して配信するかは初回ロード速度との兼ね合いで決定する。
*   **パフォーマンス最適化**: `runningMode: "VIDEO"` を必ず指定し、タイムスタンプ（`performance.now()` 等）を正しく渡すことでストリーミングに最適化された挙動になる。
