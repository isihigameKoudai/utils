---
name: ci-cd-and-automation
description: このリポジトリの品質ゲート(ローカルでの lint / build / test = 擬似 CI)を push 前に強制する。push・PR 作成の前、またはゲートの失敗を修正するときに使用する。コードを書いている途中の単発テスト実行には不要(.agents/skills/test-driven-development/SKILL.md を使う)。
---

# CI/CD and Automation

## ゴール

- 「lint / build / test がすべて green であることをローカルで確認してから push する」を例外なく守る
- Vercel のデプロイ失敗(= build 失敗)を push 前に検出する

## このリポジトリでの前提

- **GitHub Actions 等の CI は存在しない**。品質ゲートはローカルコマンドのみ。これを「擬似 CI」として扱う
- デプロイは Vercel(`vercel.json` あり)。push で自動デプロイされ、**Vercel 側でも `pnpm run build` 相当が走る**。つまりローカルで build が通らないものを push すると、そのままデプロイ失敗になる
- husky pre-commit で lint-staged(eslint --fix + prettier)が走るが、これは**ステージされたファイルのみ**が対象。リポジトリ全体のゲートの代わりにはならない
- パッケージマネージャは **pnpm のみ**(npm / yarn コマンドは誤り)

## 手順

### push 前の擬似 CI(必須)

```bash
pnpm run lint && pnpm run build && pnpm vitest run
```

3 つすべて green になるまで push しない。個別の意味:

| コマンド | 内容 | 失敗時の対応 |
|---|---|---|
| `pnpm run lint` | eslint(`--fix` 付き、src/utils 全体) | 自動修正後も残るエラーを手で直す。ルール無効化はしない |
| `pnpm run build` | `tsc && vite build`(型チェック + 本番ビルド) | 型エラー・ビルドエラーを修正。Vercel デプロイ可否と同義 |
| `pnpm vitest run` | 全テスト 1 回実行 | `.agents/skills/test-driven-development/SKILL.md` の手順で修正 |

補助コマンド:

```bash
pnpm run tsr       # ts-remove-unused: 未使用 export の検出(リファクタ・削除作業後に)
pnpm run preview   # 本番ビルドのローカル確認(リリース前。.agents/skills/shipping-and-launch/SKILL.md 参照)
```

### ゲートが落ちたとき

1. エラー出力を読み、該当箇所を修正する(出力を読まずに再実行しない)
2. 修正後、**落ちたコマンドだけでなく 3 コマンドすべて**を再実行する(修正が別のゲートを壊すことがある)

## 任意: GitHub Actions を導入する場合の最小 workflow

将来 CI を導入するなら、ローカルゲートと同一の 3 コマンドをそのまま移す:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run build
      - run: pnpm vitest run
```

ローカルゲートと CI の内容を乖離させないこと(CI だけにあるチェック・ローカルだけにあるチェックを作らない)。

## Hard rules

- **ローカルゲート(lint / build / test)を通さずに push しない**。「軽微な変更だから」は理由にならない — push は即デプロイである
- **ゲートを緑にするための skip・無効化をしない**: テストの skip / 削除、eslint-disable の追加、`@ts-ignore` / `@ts-expect-error` での握りつぶしは禁止
- 「全部 green」と報告する前に、実際にコマンドを実行し出力を確認する
- npm / yarn コマンドを使わない(lockfile が壊れる)

## 完了チェックリスト

- [ ] `pnpm run lint` が green(出力を確認した)
- [ ] `pnpm run build` が green(出力を確認した)
- [ ] `pnpm vitest run` が green(出力を確認した)
- [ ] ゲートを通すための skip・無効化・握りつぶしをしていない
- [ ] 上記をすべて満たした後に push した
