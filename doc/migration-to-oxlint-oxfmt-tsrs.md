# biome → oxlint / oxfmt / tsrs 移行と速度比較

`@biomejs/biome` を撤去し、Oxc ツールチェーン（`oxlint`・`oxfmt`）と Rust 実装の TypeScript コンパイラ `tsrs` に移行した際の、before / after の実行速度を記録する。

## 変更内容

| 役割 | Before | After |
| --- | --- | --- |
| Lint | `biome check src utils` | `oxlint src utils`（**type-aware = true**） |
| Format | （biome check に内包） | `oxfmt --check / --write src utils` |
| Type check（開発時） | `tsc --noEmit` | `tsrs --noEmit --fast`（`pnpm typecheck`） |

- `oxlint` は `options.typeAware: true` で、`tsrs` を型情報バックエンドとして使用（型情報を要する `typescript/*` ルールが有効）。
- `tsrs` は TypeScript 7 コンパイラの Rust ポート（`0.25.0-ts7.1.0-beta`）。`tsc` のドロップイン代替で、`--fast` でチェッカー数・キャッシュを最適化。
- `biome.json` は削除し、ルール設定は `.oxlintrc.json`、フォーマッタ設定は `.oxfmtrc.json`（`oxfmt --migrate=biome` で生成）へ移行。
- `build` スクリプトは `tsc && vite build` のまま（後述の glibc 制約により、本番ビルドは可搬性の高い `tsc` を維持）。

## ベンチマーク方法

- ツール: [hyperfine](https://github.com/sharkdp/hyperfine)
- 環境: 4 vCPU / AMD EPYC（Docker サンドボックス内、Node v26 / pnpm 12）
- 対象: `src` + `utils`（TypeScript / TSX 304 ファイル）
- 各コマンドは `pnpm exec` 経由で実行（pnpm の起動オーバーヘッドを含む、同一条件）

| コマンド | warmup / runs |
| --- | --- |
| `tsc --noEmit` | 1 / 3 |
| その他 | 2 / 5（oxfmt のみ 3 / 10） |

## 結果

| ステップ | Before | After | 改善率 |
| --- | --- | --- | --- |
| **Type check** | `tsc --noEmit` **14.44 s** ±1.03 | `tsrs --noEmit --fast` **2.22 s** ±0.05 | **6.5×** |
| Lint | `biome check` **1.14 s** ±0.03 | `oxlint`（type-aware）**1.80 s** ±0.07 | 0.6×（type-aware 化のため増） |
| Format check | （biome check に内包） | `oxfmt --check` **0.28 s** ±0.01 | — |
| **合計** | **≈ 15.6 s** | **≈ 4.3 s** | **≈ 3.6×** |

### 主なポイント

- **Type check が 6.5× 高速化（14.44 s → 2.22 s）**。これが最大の改善で、エンドツーエンドの開発チェックを約 12 秒短縮する。
- Lint は 1.14 s → 1.80 s と遅くなっているが、これは **type-aware ルール（typescript-eslint 由来、59 ルール）を有効化した対価**。`biome` では検出できなかった型依存のバグ（未処理 Promise、unsafe な代入 など）を lint で拾えるようになる。
- `oxfmt` は 304 ファイルを ~0.3 秒で検査。biome のフォーマット結果とほぼ一致しており（差分は `.css` の引用符 1 ファイルのみ）、PR の再フォーマット差分は最小限。

## ESLint との比較（参考）

biome ではなく ESLint（`@eslint/js` + `typescript-eslint` + `eslint-plugin-react` / `react-hooks` / `jsx-a11y` の recommended 構成）を相手にした場合の速度差。同一 304 ファイル・同一条件（`pnpm exec` 経由、hyperfine）。

| モード | ESLint | oxlint | 高速化 |
| --- | --- | --- | --- |
| type-aware | **43.0 s** ±0.9 | **1.80 s** ±0.07 | **≈ 24×** |
| non-type-aware | **14.3 s** ±0.4 | **0.32 s** ±0.01 | **≈ 45×** |

- ESLint の type-aware は `typescript-eslint` の `recommendedTypeChecked`（`projectService` で型情報を解決）。実際に型を追っており、このコードベースで 39 件（36 error / 3 warning）を検出したことを確認済み（空回りで速いわけではない）。
- **但し書き**: `typescript-eslint` は TypeScript 7 に未対応（peer が `<6.1.0`）のため、type-aware の ESLint 計測のみ `typescript@5.9.3` に差し替えて実施した。oxlint は `tsrs`（TS 7 ネイティブ）で動くため、**TS 7 を扱えるのは oxlint 側だけ**という点自体が ESLint に対する優位。
- ルールセットは「recommended」同士で完全な 1:1 ではない（oxlint は unicorn / oxc プラグイン分だけ多め）。ただしオーダーの差は揺るがないため参考値として記録。

## 注意点

- `tsrs` はベータ版（`0.25.0-ts7.1.0-beta`）。TypeScript 7.1 への 100% 準拠を目指しており、本リポジトリでは `tsc --noEmit` と同一の診断結果（エラー 0 件）を確認済み。万一の差異に備え、`typescript`（`tsc`）は devDependencies に残してある。
- `tsrs` のネイティブバイナリ（`@tsrs/linux-x64-gnu`）は **glibc 2.34 以上**を要求する。Vercel 等の古いビルドイメージでは実行できないため、`build` は可搬性の高い `tsc` のままにし、`tsrs` は開発時の `pnpm typecheck` で使用する。glibc 2.34 以上の環境なら `build` の `tsc` を `tsrs --noEmit --fast` に置き換えても同じ結果が得られる。
- `pnpm` の supply-chain ポリシー（`trustPolicy: no-downgrade`）が `tsrs@0.25.0-ts7.1.0-beta` を「trust downgrade」としてブロックするため、`pnpm-workspace.yaml` の `trustPolicyExclude` に追加した（既存の `semver@6.3.1` / `reselect@5.1.1` と同様の対応）。
- biome の `performance/noAccumulatingSpread`（オブジェクトスプレッドの蓄積）は oxlint に等価ルールがないため、対応する抑制コメント 2 件は削除した。
