---
name: frontend-ui-engineering
description: このリポジトリの規約(typestyle・配置ルール・React 19)に沿って production 品質の UI を構築する。コンポーネント・ページの新規作成や既存 UI の変更、レイアウト・状態管理の実装時に使用する。utils/ の純粋ロジックのみの変更や、UI を伴わない設定変更では使わない。
---

# Frontend UI Engineering

## ゴール

- 配置ルール(依存方向)に違反しないコンポーネントを作る
- typestyle ベースで、アクセシブルかつ「AI 生成っぽくない」UI に仕上げる
- loading / error / empty の 3 状態を最初から備える

## このリポジトリでの前提

- React 19 + TypeScript strict + Vite。クライアントサイドのみの SPA
- ルーティングは TanStack Router file-based(`src/routes/`)。`src/generated/routeTree.gen.ts` は生成物、編集禁止
- スタイリングは **typestyle(CSS-in-TS)**。**Tailwind は不使用** — `className="flex gap-3"` のような例は誤り
- 依存方向: `routes → features → components → utils`。`features/A → features/B` 禁止

## 配置判断(最初にやる)

```
そのコンポーネントは domain-agnostic か?
├─ Yes → src/components/(feature への import 禁止。再利用可能であること)
└─ No(feature 固有)
    ├─ ページ(URL と 1:1)→ src/features/<Feature>/pages/
    └─ それ以外 → src/features/<Feature>/components/
```

迷ったら feature 側に置く。複数 feature から使われ始めた時点で `src/components/` へ昇格する。

## コンポーネント構成(doc/templates/component.md)

```
SampleButton/
  index.tsx       # 本体
  types.ts        # 型(必要時)
  styles.ts       # typestyle 定義(optional)
  constants.ts    # 定数(optional)
  hooks.ts        # ロジック分離(optional)
```

- Props interface はコンポーネント定義の直上に書く。named export(ページのみ default export)
- 型 import は必ず `import type`
- React 19: class component 禁止。`forwardRef` 不要(ref は通常の props で受け取る)
- React Compiler 未導入のため `useMemo` / `useCallback` は計測根拠がある場合のみ使う

## スタイリング(typestyle)

`@/utils/ui/styled` の `styled` でスタイル付きコンポーネントを `styles.ts` に定義する。実例(`src/features/AggregateBill/components/BillBarChart/styles.ts`):

```typescript
import { styled } from '@/utils/ui/styled';

/** ソートボタン */
export const SortButton = styled('button')({
  padding: '0.25rem 0.75rem',
  borderRadius: '4px',
  $nest: {
    '&:hover': { backgroundColor: '#f0f0f0' },
    '&[data-active="true"]': { backgroundColor: '#8884d8', color: '#fff' },
  },
});
```

- 擬似クラス・属性セレクタは `$nest` を使う
- 単発のレイアウトには `@/utils/ui/Box`(`<Box as="header" zIndex={10}>`)も使える
- spacing は `0.25rem` 刻みのスケールに乗せる(`13px` のような端数値を発明しない)

## 状態管理の使い分け

| 状態の種類 | 手段 |
|---|---|
| コンポーネント内の UI 状態 | `useState` |
| 共有可能・リロード耐性が必要(フィルタ・タブ等) | URL state(TanStack Router の search params) |
| feature 内で複数コンポーネントが読み書きする状態 | zustand(実例: `src/features/AggregateBill/stores/`、`utils/i-state`) |
| read-heavy / write-rare(テーマ等) | Context(これ以外の用途で Context を使わない) |

props のバケツリレーが 3 階層を超えたら構造を見直す。

## AI っぽい見た目を避ける

| AI デフォルト | 代わりに |
|---|---|
| 紫・indigo のグラデーション | プロジェクトの実際の配色 |
| 過剰な角丸(全部 16px+) | 控えめで一貫した borderRadius |
| 全要素に均等な過剰 padding | 階層に応じた spacing |
| 一律のカードグリッド・汎用 hero | コンテンツ優先のレイアウト |
| 多層シャドウ | 影は最小限 |

## アクセシビリティ(要点)

- インタラクティブ要素は `<button>` / `<a>` を使い、Tab で到達・Enter/Space で操作できること
- アイコンのみのボタンには `aria-label`、input には `<label htmlFor>` を付ける
- コントラスト比 4.5:1(通常テキスト)。色だけで状態を伝えない
- データを表示する画面は **empty / loading / error state を必ず実装**(空白画面を出さない)

詳細チェックは `.agents/references/accessibility-checklist.md` に従う。

## Hard rules

- Tailwind クラス・CSS ファイル・styled-components を導入しない。typestyle で書く
- `src/components/` から `src/features/` を import しない。`features/A` から `features/B` を import しない
- `src/generated/` 配下を編集しない
- class component・`forwardRef` を新規に書かない
- 計測根拠なしに `useMemo` / `useCallback` を追加しない
- empty / loading / error state のないデータ表示 UI を完了としない

## 完了チェックリスト

- [ ] 配置が正しい(domain-agnostic → `src/components/`、feature 固有 → `features/<X>/components/`、ページ → `pages/` で URL と 1:1)
- [ ] スタイルは typestyle(`styles.ts`)で定義されている
- [ ] loading / error / empty state がある
- [ ] キーボードのみで操作できる・ラベルがある
- [ ] ブラウザの console エラーゼロ(`.agents/skills/browser-testing-with-devtools/SKILL.md` で実機確認)
- [ ] 320 / 768 / 1024 / 1440px で崩れない
- [ ] `pnpm vitest run` / `pnpm run lint` / `pnpm run build` が通る
