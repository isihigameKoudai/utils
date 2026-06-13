# Agent Personas

このリポジトリ専用の専門家ペルソナ。各ファイルは Claude Code 等のハーネスで **subagent の system prompt** として読み込まれ、1 つの役割・1 つの観点・1 つの出力フォーマットでレポートを返す。

| ペルソナ | 役割 | 主な用途 |
|---------|------|---------|
| [code-reviewer](code-reviewer.md) | シニアレビュアー | 依存方向・import type・命名・300 行制限など AGENTS.md 規約に基づくマージ前レビュー |
| [security-auditor](security-auditor.md) | セキュリティ監査 | VITE_ env 露出・XSS・valibot 未検証・pnpm audit・git 履歴(クライアント SPA 特化) |
| [test-engineer](test-engineer.md) | テストエンジニア | Vitest でのテスト設計・カバレッジ分析・バグ再現テスト(Prove-It) |
| [web-performance-auditor](web-performance-auditor.md) | パフォーマンス監査 | rAF ループ・three.js dispose 漏れ・ML 推論・再レンダリング・バンドル |

## スキル・references との関係

| 層 | 何か | 例 | 役割 |
|----|------|----|------|
| **スキル** | 手順と完了条件を持つワークフロー | `.agents/skills/test-driven-development/SKILL.md` | *how* — 作業の進め方 |
| **reference** | チェックリスト・パターン集 | `.agents/references/testing-patterns.md` | 深掘り資料 — スキル/ペルソナから委譲される |
| **ペルソナ** | 観点と出力フォーマットを持つ役割 | `code-reviewer` | *who* — 1 観点のレポートを返す |

オーケストレータは **メインセッションとユーザ**。ペルソナは他のペルソナを呼ばない(Claude Code では subagent が subagent を生成できないため、プラットフォームでも強制される)。委譲パターンの詳細は `.agents/references/orchestration-patterns.md`。

## 使い分け

### 直接呼び出し(基本)

1 つの観点を 1 つの対象に当てるとき。Agent ツールの prompt に該当ペルソナファイルの観点を読み込ませる。

- 「この diff をレビューして」→ `code-reviewer`
- 「`utils/ai/` にセキュリティ問題はないか」→ `security-auditor`
- 「`utils/promise/` のテストの穴は」→ `test-engineer`
- 「Noise ルートがカクつく原因を監査して」→ `web-performance-auditor`

### 並列ファンアウト(節目のみ)

リリース前点検など、同じ diff に独立した複数観点が必要なときだけ。**1 メッセージで複数の Agent 呼び出しを同時発行**し、レポートをメインでマージする。日常の小さい diff には過剰。

### 反証レビュー

自分(メインセッション)が書いた変更の粗探しを、実装の文脈を持たない subagent に `code-reviewer` の観点でやらせる。指摘の採否と修正はメインで行う。

## ペルソナ共通のルール

1. 1 ペルソナ = 1 役割 = 1 出力フォーマット。役割が 2 つになったらファイルを分ける
2. ペルソナは指摘のみ返す。**編集はメインセッションが行う**
3. 指摘は必ず `path:line` + 重要度 + 根拠。根拠のない指摘は格下げする
4. このリポジトリの実態に反する前提(npm/yarn、Tailwind、サーバサイド、CI)を持ち込まない。コマンドはすべて pnpm
5. 他ペルソナの深掘りが必要なときは、レポート内で「推奨」として書く(自分で呼ばない)

## 新しいペルソナの追加手順

1. `agents/<role>.md` を既存と同じ frontmatter(`name`, `description`)で作成する
2. 役割(1-2 文)/ このリポジトリの規約に接地した観点 / 手順 / 出力フォーマット(path:line + 重要度 + 根拠)/ Hard rules を 60〜120 行で書く
3. 深掘りはペルソナ内に書かず `.agents/references/` か `.agents/skills/<name>/SKILL.md` へ委譲する
4. このファイルの一覧表に追加する
