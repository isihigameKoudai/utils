---
name: code-review-and-quality
description: 変更差分を多軸（正しさ・設計・依存方向・型・テスト）でレビューし、path:line + 重要度つきの指摘を出す。マージ前・実装完了後・他のエージェントが書いたコードの評価時に使用する。挙動を変えない整理は code-simplification の領分なのでこのスキルでは行わない。
---

# Code Review and Quality

## ゴール

- 変更が「コードベース全体の健全性を確実に改善するか」を判定する。完璧は求めない — 自分ならこう書く、はブロック理由にならない
- すべての指摘に `path:line` + 重要度（blocker/should/nit）+ 根拠を付け、著者が「必須」と「任意」を区別できる状態にする

## このリポジトリでの前提

- React 19 + TypeScript strict + Vite 8。`utils/` = 再利用ユーティリティ、`src/` = features アーキテクチャ
- パッケージマネージャは pnpm のみ。npm / yarn のコマンドを提案したら誤り
- 依存方向は一方向のみ: `routes → features → components → utils`。AGENTS.md が単一情報源

## 手順

### 1. コンテキスト把握

差分を読む前に「この変更は何を達成しようとしているか」「期待される挙動変化は何か」を確認する。不明ならコードより先に著者（またはタスク記述）に当たる。

### 2. ゲートコマンドを回す

レビュー所見より先に機械チェック。落ちていたらそれが第一の blocker。

```bash
pnpm run lint && pnpm run build && pnpm vitest run
```

### 3. 依存方向の機械的チェック

禁止 import を rg で検出する（推測でなく実行する）:

```bash
# components/・utils/ から features への依存（禁止）
rg "from '@/features/" src/components/ utils/
# utils/ から src/ への依存（禁止）
rg "from '@/src/|from '\.\./\.\./src" utils/
# features 間の相互依存（禁止）: 各 feature 内で他 feature 名を検索
rg "from '@/features/" src/features/ | rg -v "features/(\w+)/.*@/features/\1"
# routes への逆依存（禁止）
rg "from '@/routes" src/features/ src/components/ utils/
```

### 4. レビュー観点

| 観点 | チェック内容 |
|---|---|
| 正しさ | 仕様どおりか。エッジケース（空配列・`undefined`・境界値）。expected failure は throw でなく `undefined`/`null` を返しているか（AGENTS.md 方針）。型ガードは `utils/guards.ts` / `utils/is.ts` を再利用しているか |
| 設計・単純さ | ファイル 300 行以内・単一目的か。3 回目の利用がない一般化（早すぎる抽象化）がないか。少ない行数で書けるのに膨らんでいないか |
| 依存方向 | 手順 3 の rg 結果。新規依存の追加は本当に必要か（既存スタックで解けないか、`pnpm audit` は通るか） |
| 型 | strict 準拠。型 import は必ず `import type`。`any`・不要な型アサーションがないか。import 順（builtin → external → `@/components/**` → `@/**` → 相対、グループ間空行） |
| テスト | 挙動変更にテストが伴うか。バグ修正に「修正前に失敗する」再現テストがあるか → `.agents/skills/test-driven-development/SKILL.md` |
| 命名・規約 | utilities は camelCase ファイル、components は PascalCase、定数は UPPER_SNAKE_CASE。バリデーションは valibot、branded types は `utils/branded`、スタイリングは typestyle（Tailwind 不使用） |

セキュリティ観点（API キー・XSS・外部入力検証）は `.agents/skills/security-and-hardening/SKILL.md`、パフォーマンス観点は `.agents/skills/performance-optimization/SKILL.md` に委譲する。疑いがあればその旨を指摘に書く。

### 5. 影響範囲が不明な変更

共有関数（特に `utils/` 配下）の変更で呼び出し元が見えない場合は `.agents/skills/callgraph/SKILL.md` で caller chain を確認してから判定する。

## Hard rules

- 指摘には必ず `path:line` を添える。差分を読まずに「LGTM」を出さない
- ゲートコマンドは必ず実行し、出力を確認してから「pass」と書く
- 重要度のない指摘を出さない。blocker 以外で著者の時間を強制しない
- 「あとで直す」を受け入れない。マージ前に直すか、課題として明示的に記録させる
- 問題は和らげずに書く。本番で踏むバグを「軽微な懸念かも」と書くのは不誠実。一方で著者に十分な文脈があり反論された場合は潔く従う
- AI が書いたコードほど精査する。自信ありげで妥当そうに見えるまま間違っていることがある
- 出力本文は日本語。識別子・パス・コマンドは原文のまま

## 出力フォーマット

````
CODE REVIEW
===========

対象: <branch / PR / 差分の概要>
ゲート: lint=<pass/fail> build=<pass/fail> test=<pass/fail>
依存方向チェック: <違反なし / 違反あり(下記)>

## 指摘
- [blocker] <path:line> — <問題> / 根拠: <なぜ問題か・どの規約か>
- [should]  <path:line> — <問題> / 根拠: <...>
- [nit]     <path:line> — <好みの範囲の提案>

## 良い点
- <維持してほしい設計判断があれば 1-3 点>

## 判定
- Approve / Request changes（blocker・should の解消が条件）
````

## 完了チェックリスト

- [ ] `pnpm run lint && pnpm run build && pnpm vitest run` を実行し結果を記載した
- [ ] 依存方向の rg チェックを実行した
- [ ] すべての指摘に `path:line` と重要度と根拠がある
- [ ] blocker がゼロ、または明示的に列挙されている
- [ ] セキュリティ / パフォーマンス疑いは該当スキルへ誘導した
