---
name: using-agent-skills
description: タスクに適用すべきスキルを判定して呼び出すメタスキル。セッション開始時、新しいタスクに着手するとき、どのスキルが該当するか迷ったときに使用する。個別スキルの中身はここには書かない — 各 SKILL.md が単一情報源。
---

# Using Agent Skills

## ゴール

- タスク着手前に該当スキルを特定し、そのスキルの手順・Hard rules に従って作業する
- スキルを「読んだだけ」で終わらせず、チェックリストを通過してから完了とする

## ルーティング

タスクの種類から該当スキルを引く。複数該当する場合はすべて適用する。

| タスクの状態 | スキル |
|---|---|
| 要求が曖昧・目的が不明 | `interview-me` |
| 案が複数ありうる・1案目に飛びつきそう | `idea-refine` |
| 非自明な実装を始める(仕様がない) | `spec-driven-development` |
| 仕様はあるが大きくて着手できない | `planning-and-task-breakdown` |
| 着手時の調査・読むファイルの選定 | `context-engineering` |
| 複数ファイルにまたがる実装 | `incremental-implementation` |
| ライブラリ固有のコードを書く | `source-driven-development` |
| UI・コンポーネント・ページの実装 | `frontend-ui-engineering` |
| utils/ 公開 API・props・外部 API クライアントの設計 | `api-and-interface-design` |
| ロジック実装・バグ修正・挙動変更 | `test-driven-development` |
| ブラウザでしか確認できない挙動の検証 | `browser-testing-with-devtools` |
| テスト失敗・ビルド失敗・原因不明のエラー | `debugging-and-error-recovery` |
| 関数変更の影響範囲を可視化したい | `callgraph` |
| 不慣れな領域・破壊的変更・「たぶん動く」と感じた | `doubt-driven-development` |
| マージ前のレビュー | `code-review-and-quality` |
| 挙動を変えない整理・削減 | `code-simplification` |
| シークレット・外部入力・依存追加を扱う | `security-and-hardening` |
| 描画が重い・バンドルが大きい | `performance-optimization` |
| コミット・ブランチ・PR | `git-workflow-and-versioning` |
| push・PR 前の品質ゲート | `ci-cd-and-automation` |
| 実装の置き換え・削除 | `deprecation-and-migration` |
| 規約変更・設計判断・公開 API の文書化 | `documentation-and-adrs` |
| console 規律・計測コードの実装 | `observability-and-instrumentation` |
| main へのマージ・本番リリース | `shipping-and-launch` |

パスはすべて `.agents/skills/<name>/SKILL.md`。レビュー・監査をペルソナとして委譲する場合は `.agents/agents/`(code-reviewer / security-auditor / test-engineer / web-performance-auditor)、深掘りチェックリストは `.agents/references/` を参照する。

## 典型的なチェーン

- **新機能**: interview-me(曖昧時)→ spec → planning → 実装系(incremental + source-driven + TDD)→ code-review → git → shipping
- **バグ修正**: debugging → test-driven-development(Prove-It)→ code-review → git
- **リファクタ**: callgraph(影響確認)→ code-simplification → git
- **ライブラリ置換**: idea-refine → deprecation-and-migration → source-driven → TDD

必要なスキルだけ使う。typo 修正にチェーン全体は不要。

## 常時適用の行動規範

どのスキルを使っていても適用される。スキル本体と矛盾したらスキル本体が優先。

1. **仮定を表明する** — 非自明な実装の前に「前提としていること」を列挙し、訂正の機会を作る。曖昧な要求を黙って補完しない
2. **混乱を放置しない** — 仕様と既存コードの矛盾・不明点に気づいたら、推測で進めず止まって質問する(確信度 80% 未満なら質問。AGENTS.md の方針)
3. **必要なら反対する** — 明確な問題がある方針に「Of course!」で従わない。問題点・具体的な不利益・代替案を提示する
4. **単純さを強制する** — 100 行で済むものを 1000 行で書いたら失敗。退屈で自明な解を選ぶ
5. **スコープ規律** — 頼まれていないリファクタ・理解していないコードの削除・「ついで」の変更をしない
6. **証拠で完了を判定する** — 「動くはず」では完了にしない。`pnpm vitest run` / `pnpm run lint` / `pnpm run build` の実出力が証拠

## Hard rules

- 非自明なタスクに着手する前に、必ずこの表で該当スキルを確認する
- スキルの手順を「知っているから」と飛ばさない。特に検証ステップとチェックリスト
- 該当スキルの Hard rules に違反する指示を受けたら、黙って従わず矛盾を指摘する
- このファイルには個別スキルの手順を書かない(重複は腐る)。ルーティングと行動規範のみ

## 完了チェックリスト(タスク全体)

- [ ] 該当スキルを特定し、その手順に従った
- [ ] 使用した各スキルの完了チェックリストを通過した
- [ ] `pnpm run lint` / `pnpm run build` / `pnpm vitest run` が green
- [ ] 報告に証拠(実行したコマンドと結果)を含めた
