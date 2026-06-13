---
name: observability-and-instrumentation
description: クライアントサイド SPA の可観測性を実装する — console の規律、文脈付きエラーハンドリング、performance.mark/measure と FPS 計測、dat.gui によるパラメータ可視化。重い feature(three.js / ML)の挙動を数値で把握したいとき、エラーの原因が console から追えないときに使用する。サーバ向けのログ基盤・メトリクス・アラート設計には使わない(このリポジトリにサーバは存在しない)。
---

# Observability and Instrumentation

## ゴール

- エラーが発生源と文脈付きで console に現れ、握りつぶされない
- 重い処理(three.js / TensorFlow.js)の所要時間・FPS を「数値で」答えられる

## このリポジトリでの前提

- **クライアントサイドのみの SPA**(React 19 + Vite 8、Vercel デプロイ)。サーバ・分散システム・SLO 運用は存在しない
- エラー監視 SaaS(Sentry 等)は**未導入**。導入は ADR 判断 → `.agents/skills/documentation-and-adrs/SKILL.md`
- expected failure は **throw せず `undefined`/`null` を返す**方針(AGENTS.md)。型ガードは `utils/guards.ts`, `utils/is.ts`
- `dat.gui` が依存に存在(package.json)。パラメータ可視化に使える
- 計測対象になりやすい feature: `src/features/Detection`(ML)、`StableFluids`、`ThreeDimension`、`Noise`、`Shader`

## 手順

### 1. console の規律

| メソッド | 用途 |
|---|---|
| `console.log` | 開発中の一時確認のみ。コミットする diff に残さない |
| `console.warn` | expected failure・フォールバック発動。文脈(feature 名・何の入力)付き |
| `console.error` | 想定外エラー(catch 節・ErrorBoundary)。元の error オブジェクトを必ず渡す |

接頭辞 `[FeatureName]` で発生源を明示する:

```typescript
console.warn('[Detection] モデルのロードに失敗。検出を無効化する', { modelUrl });
```

### 2. エラーハンドリングの二分

**expected failure**(不正入力・データ未取得など起こりうる失敗)— throw せず `undefined`/`null` を返し、呼び出し元で分岐する:

```typescript
const bills = parseBillCsv(raw); // Bill[] | undefined
if (!bills) {
  console.warn('[AggregateBill] CSV の解析に失敗', { length: raw.length });
  return;
}
```

**unexpected failure**(バグ・想定外の状態)— 描画クラッシュを白画面で終わらせない。feature の page 単位で ErrorBoundary を置き、`console.error` に元 error と文脈を出す。

空 catch・無言 return での握りつぶしは禁止。「処理を続けてよい理由」をコメントに書けないなら、それは握りつぶしてよい失敗ではない。

### 3. パフォーマンス計測

単発の重い処理(モデルロード・初期化・大きな変換)は `performance.mark/measure`。計測名は `feature:処理` 形式で揃える:

```typescript
performance.mark('detection:load:start');
await detector.load();
performance.mark('detection:load:end');
performance.measure('detection:load', 'detection:load:start', 'detection:load:end');
console.table(performance.getEntriesByType('measure'));
```

measure は DevTools の Performance パネル(Timings)にも表示される。

毎フレーム処理(three.js / ML 推論ループ)は FPS で見る:

```typescript
let last = performance.now();
const tick = (now: number) => {
  const fps = 1000 / (now - last);
  last = now;
  // 表示は dat.gui か画面隅の要素で。計測が済んだら削除する
  requestAnimationFrame(tick);
};
```

### 4. デバッグ容易性

- 残す必要のある計測・デバッグ表示は `import.meta.env.DEV` でガードし、本番ビルドから除外する
- 連続値パラメータ(シェーダの uniform・シミュレーション係数)の調整は dat.gui で可視化する:

```typescript
import * as dat from 'dat.gui';

const gui = new dat.GUI();
gui.add(params, 'viscosity', 0, 1, 0.01);
gui.addColor(params, 'baseColor');
```

- 状態のダンプ: Zustand store は `store.getState()` を console から確認できる。構造が深い状態は `console.table` / `JSON.stringify(state, null, 2)` で出す

### 5. 検証

```bash
rg "console\.log" src utils   # 残骸チェック(意図して残すものは DEV ガード付きのみ)
pnpm run lint
pnpm run build
pnpm vitest run
```

ブラウザで対象ページを開き console エラーゼロを確認する → `.agents/skills/browser-testing-with-devtools/SKILL.md`

## Hard rules

- コミットする diff に裸の `console.log` を残さない(`import.meta.env.DEV` ガード付きの意図的な計測のみ可)
- エラーを握りつぶさない。空 catch・expected failure の無言 return・error オブジェクトを捨てた自作メッセージだけの出力を書かない
- expected failure に throw を使わない(`undefined`/`null` 返し + 呼び出し元分岐。AGENTS.md の方針)
- サーバ前提の道具(構造化ログ基盤・RED メトリクス・分散トレーシング・アラート設計)をこのリポジトリに持ち込まない
- 「速くなった/遅い」を数値なしで報告しない。`performance.measure` か FPS の実測値を添える

## 完了チェックリスト

- [ ] expected failure はすべて `undefined`/`null` 返し + 呼び出し元で分岐し、必要な箇所に文脈付き `console.warn` がある
- [ ] 想定外エラーは ErrorBoundary か catch で、元 error と文脈付きの `console.error` に出る
- [ ] 計測コードは `feature:処理` 形式の名前を持ち、不要分は削除済み・残す分は DEV ガード付き
- [ ] `rg "console\.log" src utils` で意図しない残骸がゼロ
- [ ] 対象ページをブラウザで開き console エラーゼロを確認した(`.agents/skills/browser-testing-with-devtools/SKILL.md`)
- [ ] `pnpm run lint` と `pnpm run build` が通る
