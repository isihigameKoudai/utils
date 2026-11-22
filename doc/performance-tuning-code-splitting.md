# ルート単位のコード分割による初期バンドル削減（2,373 kB → 270 kB）

TanStack Router の `autoCodeSplitting` を有効化し、単一チャンクに束ねられていた本番バンドルをルート単位の遅延チャンクへ分割した際の、before / after のバンドルサイズを記録する。

## 動機

`pnpm build` 時に「chunk が 500 kB を超える」警告が出ており、実測で **単一チャンク `index-*.js` が 2,373 kB（gzip 659 kB）** に達していた。原因は、全ルートが `createFileRoute(...)({ component: X })` で feature ページを**静的 import** していたため、three.js / @mediapipe/tasks-vision / @google/genai / chromadb / recharts / lightweight-charts が初期ロードにすべて載っていたこと。

## 変更内容

| ファイル | 変更 |
| --- | --- |
| `apps/web/vite.config.ts` | `TanStackRouterVite({ autoCodeSplitting: true })` を追加。プラグイン順序を `TanStackRouterVite` → `react()` に変更（code-splitter が JSX transform より前を要求するため） |
| `apps/web/src/routes/__root.tsx` | `TanStackRouterDevtools` を `import.meta.env.DEV` ガード＋ `lazyRouteComponent` による遅延読み込みに変更（本番バンドルから除外） |

`apps/web/package.json` の `build` スクリプトは `tsc && vite build` のまま（当初 `tsrs --noEmit --fast` への置換を検討したが、`tsrs` のネイティブバイナリが glibc 2.34 以上を要求し Vercel のビルドイメージで動かないため revert。`doc/migration-to-oxlint-oxfmt-tsrs.md` の「注意点」参照）。

## ベンチマーク方法

- `pnpm build`（Vite 8 / Rolldown）による本番ビルドのチャンク表を before / after で比較。
- 環境: Docker サンドボックス（Node v26 / pnpm 12）。

## 結果

### 初期ロード（エントリチャンク）

| | minified | gzip |
| --- | --- | --- |
| **Before** | 2,373.16 kB | 658.61 kB |
| **After** | **269.67 kB** | **85.69 kB** |

**初期ロード gzip を 659 kB → 86 kB（約 87% 削減、約 7.7×）。**

### After のチャンク構成（主要）

| チャンク | minified | gzip | 内訳 |
| --- | --- | --- | --- |
| `index-*.js` | 269.67 kB | 85.69 kB | 初期ロード（React + Router + アプリシェル） |
| `three.module-*.js` | 695.50 kB | 176.47 kB | three.js（3D 系ルートのみ） |
| `gemini-embedding-*.js` | 370.80 kB | 79.09 kB | @google/genai + chromadb |
| `summary-*.js` | 347.61 kB | 103.55 kB | recharts（AggregateBill） |
| `CandleStick-*.js` | 162.39 kB | 52.75 kB | lightweight-charts（Crypto） |
| `react-three-fiber.esm-*.js` | 154.64 kB | 49.33 kB | @react-three/fiber |
| `HandPoseDetection-*.js` | 137.97 kB | 41.15 kB | @mediapipe/tasks-vision |
| `fluids-*.js` | 64.23 kB | 18.02 kB | 流体シミュレーション |

計 59 チャンクに分割。重いライブラリは各ルートの遅延チャンクへ分離され、当該ルートへの遷移時にのみ取得される。さらに devtools チャンク（63.61 kB）が本番ビルドから消えた。

## 検証

- `pnpm typecheck`（tsrs）: エラー 0 件で通過
- `pnpm lint`（oxlint）: 既存 warning のみ（本変更由来の追加なし）
- `pnpm test`（vitest）: 210 通過 / 14 失敗。失敗はすべて `Media/Audio.test.ts` と `Visualizer.test.ts` の既存不具合（`AudioContext` モックがコンストラクタでないこと）で、本変更とは無関係（`git status` で対象ファイル無変更を確認）

## 注意点・残課題

- `three.module` は依然 500 kB 超（695.50 kB）だが、three.js 自体のサイズであり 3D ルート遷移時のみロード。単一ライブラリ由来のため許容。
- `chromadb` の `node:process` externalize 警告（`Module "node:process" has been externalized for browser compatibility`）は残存するが、gemini-embedding チャンクに閉じ込め済みで初期ロードへの影響はない。ブラウザで実際に ChromaDB へ接続できるかは別途要検証。

## トレードオフ

- ルート遷移時に初回のみ遅延チャンクの HTTP リクエストが発生する（初期表示は高速化）。チャンク数が増えても各チャンクは小さく、共有ライブラリは Rolldown の自動チャンク分割で 1 つにまとまるため実害は小さい。
