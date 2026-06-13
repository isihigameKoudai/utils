---
name: performance-optimization
description: 計測 → ボトルネック特定 → 修正 → 再計測の順でパフォーマンスを改善する。three.js / canvas / ML 推論ループの描画が重いとき、バンドルサイズや初期ロードが問題のときに使用する。計測データなしの「とりあえず useMemo」のような推測最適化には使わない（それは禁止事項）。
---

# Performance Optimization

## ゴール

- 修正前後の具体的な数値（フレーム時間・トレース・バンドルサイズ）が存在し、改善が証明された状態で完了する
- 計測が示した実際のボトルネックだけを直す。推測で複雑さを足さない

## このリポジトリでの前提

- 主戦場は **three.js / canvas / GLSL シェーダ / MediaPipe・TensorFlow.js の ML 推論ループ / オーディオ処理**。サーバはないので N+1 クエリ等のバックエンド最適化は対象外
- **React Compiler 未導入**。useMemo / useCallback / React.memo は計測根拠がある場合のみ追加する（AGENTS.md / プロジェクト方針）
- 計測手段: **Chrome DevTools MCP の performance trace**（利用可能）、React DevTools Profiler、`pnpm run build` の出力サイズ
- 詳細チェックリストは `.agents/references/performance-checklist.md` に委譲

## 手順

### 1. 計測（必須・最初）

```bash
pnpm run dev    # 対象 feature のページを開く
```

- **描画・操作の遅さ**: Chrome DevTools MCP で performance trace を記録 → 50ms 超の long task、フレーム落ち箇所を特定
- **再レンダリング疑い**: React DevTools Profiler で「何が・なぜ・何回」レンダリングされたかを記録
- **初期ロード・バンドル**: `pnpm run build` の出力でチャンクごとのサイズを確認

```
症状から計測対象を選ぶ:
├── アニメーション・描画がカクつく → performance trace（rAF フレーム内の処理時間）
├── 操作後に UI が固まる → long task / ML 推論がメインスレッドを塞いでいないか
├── 初期表示が遅い → build 出力サイズ、route が重い feature を同期 import していないか
└── しばらく使うと重くなる → メモリ（Heap snapshot）。dispose 漏れ・リスナー解除漏れ
```

### 2. ボトルネック特定 — このリポジトリの頻出パターン

| 領域 | 典型的な原因 | 確認方法 |
|---|---|---|
| three.js / canvas | `requestAnimationFrame` ループ内での毎フレームのオブジェクト生成（`new Vector3()`、配列・クロージャ）→ GC スパイク | trace の GC イベント。ループ内 `new` を rg で点検 |
| three.js | geometry / material / texture の dispose 漏れ、リサイズごとの再生成 | Heap snapshot の増加傾向 |
| ML 推論 | 推論結果を毎フレーム setState して React 再レンダリングを誘発 | Profiler。描画は ref + canvas 直書きにし、React を経由しない |
| React | 親の再レンダリングで重い feature コンポーネントが re-mount し WebGL コンテキスト・モデルを作り直す | Profiler の mount 表示。key の変化、コンポーネント定義のインライン化を疑う |
| バンドル | three / MediaPipe / chromadb 等の重依存が初期チャンクに同期で入る | build 出力。route 単位の dynamic import（`lazy(() => import(...))`）で分割 |

### 3. 修正

- 1 つのボトルネックに 1 つの修正。複数を混ぜると効果測定不能になる
- rAF ループ内のアロケーションはループ外で確保して再利用する
- useMemo / useCallback / React.memo は Profiler が「この再計算・再レンダリングが原因」と示した場合のみ追加し、根拠（計測値）をコミット / 報告に残す

### 4. 再計測と回帰確認

```bash
pnpm vitest run && pnpm run lint && pnpm run build
```

- 修正前と同一条件で trace / Profiler / build サイズを取り直し、before / after を数値で比較する
- 改善が確認できなければ revert する。複雑さだけ増えた最適化は負債

## Hard rules

- **計測なしの最適化は禁止**。trace / Profiler / build 出力のいずれかの「前」の数値がない状態で最適化コードを書かない
- 「この最適化は自明」は禁句。計測していないなら知らないのと同じ
- useMemo / useCallback / React.memo を予防的・網羅的に貼らない（React Compiler 未導入でも同じ。過剰なメモ化は不足と同じくらい有害）
- before / after の数値を出さずに「速くなった」と報告しない
- 挙動を変えない: 最適化後に `pnpm vitest run` green を確認する
- 自分のマシンの体感で判断しない。trace は CPU スロットリングをかけて代表的な条件で取る
- 出力本文は日本語。識別子・パス・コマンドは原文のまま

## 出力フォーマット

````
PERF REPORT
===========

対象: <feature / ページ / 操作>
計測手段: <Chrome DevTools MCP trace / React Profiler / build output>

## Before
- <指標>: <数値>（計測条件: <CPU throttle 等>）

## ボトルネック
- <path:line> — <原因> / 根拠: <trace 上の何がそれを示すか>

## 修正内容
- <変更の要約>

## After
- <同一指標>: <数値> （改善率）

## 回帰確認
- pnpm vitest run: <green/red> / pnpm run build: <pass + サイズ差分>
````

## 完了チェックリスト

- [ ] 修正前の計測値がある（trace / Profiler / build サイズ）
- [ ] 修正後に同一条件で再計測し、数値で比較した
- [ ] 追加した useMemo / useCallback / memo すべてに計測根拠がある
- [ ] `pnpm vitest run` が green、`pnpm run build` が通る
- [ ] バンドルサイズが意図せず増えていない
- [ ] 効果のなかった変更は revert した
