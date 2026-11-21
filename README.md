# utils

開発のための便利なユーティリティコレクション（pnpm workspaces モノレポ）。

## 構成

```
apps/
  └── web/            # アプリ本体 (Vite + React 19 + TanStack Router)
packages/
  ├── core/           # 純粋ユーティリティ (@utils/core)
  ├── modules/        # ライブラリ/React/ブラウザAPI のラップ・利用 (@utils/modules)
  └── domains/        # ドメイン特化 (crypto 等) (@utils/domains)
```

依存方向: `apps/web → packages/{domains → modules → core}`

## コマンド

```bash
pnpm install       # 依存インストール
pnpm dev           # 開発サーバー
pnpm build         # ビルド
pnpm test          # テスト
pnpm lint          # oxlint
pnpm typecheck     # tsrs
```

## 配信

- アプリ: [util-packages.vercel.app](https://util-packages.vercel.app/)
