# AGENTS.md

モットー: 「小さく、明確で、安全な一歩を。常に実際のドキュメントに根拠を置く。」

## プロジェクト概要

再利用可能なユーティリティと共有コンポーネントのための React 19 + TypeScript モノレポ（pnpm workspaces）。

- `packages/core` — 純粋ユーティリティ（array, file, math, object, promise, di, model, api など）。外部依存は valibot のみ。
- `packages/modules` — ライブラリ／React／ブラウザAPI のラップ・利用（ui, i-state, tensorflow, ai, db, Shader/Visualizer/Media など）。
- `packages/domains` — ドメイン特化（crypto の GMO/Binance API など）。`@utils/core` に依存。
- `apps/web` — それらを利用するアプリ本体（Vite + TanStack Router）。

依存方向: `apps/web → packages/{domains → modules → core}`（core が最下層・最も汎用的）。

## ビルド／Lint／テストのコマンド

```bash
# 開発
pnpm run dev         # 開発サーバー起動（Vite, @utils/web）
pnpm run build       # TypeScript コンパイル + Vite ビルド（@utils/web）
pnpm run preview     # 本番ビルドのプレビュー

# Vitest によるテスト
pnpm run test        # 全テストを一度だけ実行（CI モード）
pnpm vitest run      # 全テストを一度だけ実行
pnpm vitest run packages/core/array/array.test.ts          # 単一テストファイルを実行
pnpm vitest run -t "splitMap"                              # パターンに一致するテストを実行
pnpm vitest run packages/core/array/array.test.ts -t "配列を指定した数で分割する"  # 特定のテスト

# Lint とフォーマット
pnpm run lint        # oxlint（type-aware）
pnpm run format      # oxfmt によるフォーマット
pnpm run typecheck   # tsrs による全パッケージの型チェック

# パッケージ単位のコマンド
pnpm --filter @utils/web build
pnpm --filter @utils/core test
```

## プロジェクト構成

```
apps/
  └── web/                 # アプリ本体 (@utils/web)
      ├── src/
      │   ├── components/  # 再利用可能な React コンポーネント（ドメイン非依存）
      │   ├── features/    # 機能ごとのモジュール（pages, components, ビジネスロジック）
      │   │   ├── AggregateBill/   # クレジットカード明細の集計
      │   │   ├── Audio/           # 音声の可視化・処理
      │   │   ├── Crypto/          # 暗号資産チャート
      │   │   ├── CsvSpreadsheet/  # CSV スプレッドシートエディタ（インポート/エクスポート付き）
      │   │   ├── Detection/       # ML ベースの検出（ポーズ・手・顔）
      │   │   ├── Home/            # ホームページ
      │   │   ├── MeltTheBorder/   # シェーダー + ML 検出のデモ
      │   │   ├── Noise/           # ノイズシェーダー（fBM, フラクタル, セルラー）
      │   │   ├── Playground/      # 開発用サンドボックス
      │   │   ├── Shader/          # シェーダー例
      │   │   ├── StableFluids/    # 流体シミュレーション
      │   │   └── ThreeDimension/  # 3D レンダリング例
      │   ├── shared/      # 機能横断で共有するモジュール
      │   ├── generated/   # 生成されたルートツリー（TanStack Router）
      │   └── routes/      # TanStack Router のルート定義
      ├── index.html
      ├── vite.config.ts
      └── vercel.json

packages/
  ├── core/                 # 純粋ユーティリティ (@utils/core)
  │   ├── array/  object/  math/  string.ts  is.ts  guards.ts  date.ts
  │   ├── promise/  file/ (csv含む)  branded/  model/  di/  api/
  │   └── index.ts          # barrel
  ├── modules/              # ライブラリ/React/ブラウザAPI利用 (@utils/modules)
  │   ├── ui/  i-state/  hooks/  unstated-next.tsx
  │   ├── tensorflow/  ai/  db/  Shader*  Visualizer/  Media/  Speech.ts
  │   ├── glsl/  __test__/
  │   └── index.ts          # barrel
  └── domains/              # ドメイン特化 (@utils/domains)
      ├── apis/             # crypto (GMO/Binance)
      └── index.ts          # barrel
```

### 依存方向（モノレポ・アーキテクチャ）

依存は一方向にのみ流れること:

```
apps/web/routes → features → components → packages/{domains → modules → core}
```

**禁止される import:**

- `packages/*` → `apps/*`（パッケージはアプリコードに依存してはならない）
- `packages/core` → `packages/modules` / `packages/domains`（core は純粋に保ち、React・ライブラリ依存を持たない）
- `packages/modules` → `packages/domains`
- `components/` → `features/`（共有コンポーネントは features に依存してはならない）
- `components/` → `routes/`（共有コンポーネントは routes に依存してはならない）
- `features/` → `routes/`（features は routes に依存してはならない）
- `features/A` → `features/B`（feature 間の import は禁止）
- `generated/` → 任意（生成ファイルは出力専用であり、routes 設定以外から直接 import しない）

## コードスタイルガイドライン

### TypeScript 設定

- **strict モード有効**: `strict: true`, `noImplicitAny: true`
- **未使用コード禁止**: `noUnusedLocals: true`, `noUnusedParameters: true`
- **パスエイリアス**: `@/*` は `apps/web/src/*` を指す。パッケージは名前で import する（`@utils/core/array`, `@utils/modules/i-state`）
- **ターゲット**: ESNext・ES モジュール構文

### フォーマット（oxfmt）

- セミコロン: 必須
- クォート: シングルクォート
- インデント: タブ（JSON / package.json は対象外）

### import の順序

oxlint により自動整形される。グループ間には空行を挿入し、各グループ内はアルファベット順。

1. **builtin** - Node.js 組み込みモジュール（`fs`, `path` など）
2. **external** - 外部ライブラリ（pnpm modules）
3. **internal** - リポジトリ内モジュール
   - `@/components/**` - 共通系 components（先に配置）
   - `@/**` / `@utils/**` - その他の内部モジュール
4. **parent/sibling/index** - 同ディレクトリ内ファイル（相対パス）

```typescript
import { useEffect } from 'react';
import { create } from 'zustand';

import { Button } from '@/components/Button';

import { fromEntries } from '@utils/core/object';

import { useLocalState } from './hooks';
import type { StateProps, QueriesProps } from './type';
```

### 型の import

型やインターフェースを import する際は必ず `type` キーワードを使う:

```typescript
// トップレベルの型 import
import type { StateProps, QueriesProps } from './type';

// インライン type 付きの名前付き import
import { someFunction, type SomeType } from './module';
```

### 命名規則

- **ファイル**: ユーティリティは camelCase（`array.ts`）、コンポーネントは PascalCase（`Menu.tsx`）
- **テストファイル**: `*.test.ts` サフィックス、ソースと同じディレクトリに配置
- **コンポーネント**: PascalCase（`RootLayout`, `NavigationHeader`）
- **関数**: camelCase（`splitMap`, `createCachePromise`）
- **型・インターフェース**: PascalCase（`ListItem`, `DeferredOut`）
- **定数**: 真の定数は UPPER_SNAKE_CASE

### コンポーネントのガイドライン

- フックのみを使う関数コンポーネント（クラスコンポーネントは使わない）
- `apps/web/src/components/` はドメイン非依存で再利用可能であること
- Props のインターフェースはコンポーネントの上に書く。名前付き export（ページは default export）

### ユーティリティ関数

- ファイルは 300 行以内。単一目的のモジュールにする
- 不変性のために `const` を使う。`index.ts` から export する
- 公開 API には `@example` 付きの JSDoc コメントを付ける

### エラーハンドリング

- 関数には明示的な戻り値型を付ける
- 想定内の失敗は throw よりも `undefined`/`null` を返すことを優先する
- `@utils/core/guards` と `@utils/core/is` の型ガードを使う
- エッジケース（空配列・undefined 値）を明示的に扱う

### テストガイドライン

- 全テストは Vitest。テストファイルはソースと並置（`array.ts` → `array.test.ts`）
- エッジケースを含むすべてのコードパスをカバーする。目標カバレッジ 80% 以上
- 外部依存にはモック・スパイを使う

## 原則

- 変更は最小限・安全・可逆的に保つ
- 明快さを巧妙さより、単純さを複雑さより優先する
- 新しい依存は必要な場合のみ追加する。可能なら削除する
- 要求されたことだけを実装する。余計な機能は追加しない

## ワークフロー

1. **計画**: 大きな編集の前に短い計画を共有する。小さくレビューしやすい diff を好む
2. **読む**: 変更前に関連ファイルをすべて特定し、完全に読む
3. **検証**: 外部 API・前提をドキュメントと照合する
4. **実装**: スコープを絞る。モジュール化された単一目的のファイルを書く
5. **テスト**: 最低 1 つのテストを追加し、既存テストがすべて通ることを確認する
6. **振り返り**: 根本原因を修正する。隣接するリスクも検討する

## 主要ライブラリ

| ライブラリ      | 用途                             |
| --------------- | ----------------------------------- |
| React 19        | フックを使う関数コンポーネント    |
| TanStack Router | ファイルベースルーティング（`apps/web/src/routes/`） |
| Zustand         | 状態管理（`packages/modules/i-state/`） |
| Vitest          | テストフレームワーク                   |
| MediaPipe       | 検出機能のための ML モデル    |

## 協業と責任

- 常に英語で考え、日本語で回答する
- 要件があいまいな場合やセキュリティに関わる場合はエスカレーションする
- 不確かさは正直に示す（確信度 80% 未満 → 質問する）
- 速度より正確さを優先する。利用可能なら context7 MCP サーバーを使う

## Cursor Rules（.cursor/rules/main.mdc より）

- プロダクションコードは `apps/web/src/`（共有モジュールは `packages/*`）に配置する
- 堅牢性・可用性・再利用性・可読性を考慮する
- 可能なら `packages/*` の共有モジュールを使う
- `apps/web/src/components/` のコンポーネントは再利用可能でドメイン非依存であること
- feature 固有のコンポーネントは `apps/web/src/features/<Feature>/components/` に置く
- ページコンポーネントは `apps/web/src/features/<Feature>/pages/` に置き、URL と 1:1 対応させる
- テストはユニットレベルで、すべての分岐とエッジケースをカバーする

## クイックチェックリスト

計画 → 読む → 検証 → 実装 → テスト → 振り返り

- [ ] TypeScript strict モード準拠
- [ ] テストを追加・更新し、通ること（`pnpm run test`）
- [ ] Lint / フォーマットを通すこと（`pnpm run lint && pnpm run format`）
- [ ] ファイル 300 行以内・公開 API に JSDoc 付き
