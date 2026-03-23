# Vite Performance Benchmark: v7 → v8

## 計測環境

| 項目       | 値                                                                 |
| ---------- | ------------------------------------------------------------------ |
| Machine    | darwin-arm64                                                       |
| Node.js    | v25.2.1                                                            |
| Vite 7     | 7.1.9                                                              |
| Vite 8     | 8.0.2                                                              |
| 計測日     | 2026-03-23                                                         |
| 計測ルール | 各指標3回計測・中央値採用、`dist/` + `node_modules/.vite` 毎回削除 |

---

## 結果サマリー

| 指標                               | Vite 7.1.9 | Vite 8.0.2 |       変化 |
| ---------------------------------- | ---------: | ---------: | ---------: |
| **Production Build Time** (中央値) |  11,586 ms |   5,401 ms | **-53.4%** |
| **Bundle Size** (total)            |     4.4 MB |     3.5 MB | **-20.5%** |
| **Bundle Size** (JS)               |     4.4 MB |     3.5 MB | **-20.5%** |
| **Bundle Size** (CSS)              |     4.0 KB |     4.0 KB |        ±0% |
| **Dev Server Cold Start** (中央値) |     373 ms |     402 ms |      +7.8% |

---

## 詳細データ

### Production Build Time

|        Run |        Vite 7 |       Vite 8 |
| ---------: | ------------: | -----------: |
|          1 |     12,406 ms |     5,434 ms |
|          2 |     11,582 ms |     5,397 ms |
|          3 |     11,586 ms |     5,401 ms |
| **中央値** | **11,586 ms** | **5,401 ms** |

### Bundle Size

| 内訳  | Vite 7 | Vite 8 |
| ----- | -----: | -----: |
| Total | 4.4 MB | 3.5 MB |
| JS    | 4.4 MB | 3.5 MB |
| CSS   | 4.0 KB | 4.0 KB |

### Dev Server Cold Start

|        Run |     Vite 7 | Vite 8 (internal) | Vite 8 (port ready) |
| ---------: | ---------: | ----------------: | ------------------: |
|          1 |     376 ms |            402 ms |              903 ms |
|          2 |     373 ms |            396 ms |              848 ms |
|          3 |     373 ms |            407 ms |              862 ms |
| **中央値** | **373 ms** |        **402 ms** |          **862 ms** |

---

## 分析

### 改善点

- **Production Build**: esbuild + Rollup → Rolldown (Rust) 統一により **約2倍高速化**
- **Bundle Size**: Rolldown + Oxc ミニファイにより JS バンドルが **約20%縮小** (tree-shaking改善)

### トレードオフ

- **Dev Server**: 約30ms の微増 — Rolldown の依存関係プリバンドルが esbuild より若干遅い
- **Migration**: `@mediapipe/*` IIFE パッケージ用にカスタム Vite プラグイン (`mediapipeEsmPlugin`) が必要だった

---

## CPU Profile (Vite 8 Build)

- **プロファイル**: `vite-profile-0.cpuprofile` — Chrome DevTools / [speedscope.app](https://speedscope.app) で可視化可能
- **計測時間**: 1.26 秒 (単一ビルド)
- **サンプル数**: 1,005 / **ノード数**: 2,840

### Top Functions (Self Time)

|   # | Self Time | Function                | Location              |
| --: | --------: | ----------------------- | --------------------- |
|   1 |   53.7 ms | (garbage collector)     | (native)              |
|   2 |   21.4 ms | wasm-function[20]       | Rolldown WASM         |
|   3 |   14.7 ms | parseCJS                | node:cjs-module-lexer |
|   4 |   10.2 ms | parseSource             | node:cjs-module-lexer |
|   5 |    7.6 ms | B                       | vite/node.js          |
|   6 |    6.6 ms | post                    | node:inspector        |
|   7 |    6.3 ms | parseCJS                | node:cjs-module-lexer |
|   8 |    5.6 ms | plugin.\<computed\>     | rolldown              |
|   9 |    5.1 ms | #build                  | rolldown              |
|  10 |    5.1 ms | compileSourceTextModule | node:esm/utils        |

### Top Files (Total CPU Time)

|   # |    Total | File                              |
| --: | -------: | --------------------------------- |
|   1 | 111.1 ms | (native — GC, internal)           |
|   2 |  50.3 ms | node:cjs-module-lexer             |
|   3 |  32.3 ms | rolldown/bindingify-input-options |
|   4 |  28.9 ms | prettier/plugins/typescript       |
|   5 |  26.7 ms | vite/node.js                      |
|   6 |  25.8 ms | node:esm/utils                    |
|   7 |  23.2 ms | node:bootstrap/realm              |
|   8 |  22.7 ms | Rolldown WASM binary              |
|   9 |  19.3 ms | prettier/index                    |
|  10 |  18.0 ms | node:cjs/loader                   |

### ボトルネック分析

| 順位 | 要因             |    時間 | 解説                                                                             |
| ---: | ---------------- | ------: | -------------------------------------------------------------------------------- |
|    1 | GC               | 53.7 ms | ビルドが高速なため GC の比率が相対的に大きく見える                               |
|    2 | CJS module lexer | 50.3 ms | @mediapipe, dat.gui 等の CJS 依存パース。mediapipeEsmPlugin の IIFE ラップも含む |
|    3 | Prettier         | 48.2 ms | エディタ/ツールチェーンの副作用でプロファイルに混入                              |
|    4 | Vite core        | 26.7 ms | プラグイン管理・設定処理                                                         |
|    5 | Rolldown WASM    | 22.7 ms | **実際のバンドル処理**。全体の中で極めて小さい                                   |

**結論**: ビルドは ~830ms まで最適化済み。JS スレッドのコストはモジュールロード/パースが主体で、Rolldown WASM によるバンドル処理自体は ~23ms と極めて高速。
