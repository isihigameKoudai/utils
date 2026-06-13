---
name: deprecation-and-migration
description: 既存実装・ライブラリ・API を別実装へ置き換える、または安全に削除する手順(利用箇所の全特定 → 新旧並走 → 段階的移行 → 削除 → 取り残し検出)を強制する。実装のすげ替え・依存パッケージの置換・機能削除を行うときに使用する。新規追加のみの変更では不要。
---

# Deprecation and Migration

## ゴール

- 利用箇所をすべて把握した上で、各ステップがテスト green のまま段階的に移行する
- 移行完了後、旧実装・旧依存・取り残し(未使用 export)がゼロになる

## このリポジトリでの前提

- 利用者は自分だけ(個人リポジトリ)。外部消費者への告知・猶予期間は不要だが、**利用箇所の全特定と段階移行の規律はコード品質のために維持する**
- `pnpm run tsr`(ts-remove-unused、tsconfig.src.json 基準)で未使用 export を機械的に検出できる。移行の「取り残し検出」はこれを使う
- 移行計画の実例: `doc/plans/migrate-to-tasks-vision.md`(tensorflow → @mediapipe/tasks-vision 移行)。計画の粒度・フェーズ分け・Before/After 計測の手本にする
- 各ステップの green 確認は `pnpm vitest run` と `pnpm run build`(.agents/skills/ci-cd-and-automation/SKILL.md)

## 手順

### 1. 利用箇所を全特定する

削除・置換の対象が「どこから・何経由で」使われているかを列挙する。

```bash
# シンボル・モジュールの直接利用
rg -n "<シンボル名>" src utils -g '!**/dist/**'
# import 経由
rg -n "from ['\"].*<モジュール名>" src utils
# 依存パッケージなら package.json と import の両方
rg -n "<パッケージ名>" package.json src utils
```

呼び出し階層が深い・re-export が絡むなど複雑な場合は `.agents/skills/callgraph/SKILL.md` で caller chain を可視化し、影響するエントリポイント(ルート・コンポーネント)まで把握する。

結果を「利用箇所リスト(path:line)」として明示してから次へ進む。

### 2. 移行計画を書く(規模が大きい場合)

複数フェーズに渡る移行は `doc/plans/` に計画を書く。`doc/plans/migrate-to-tasks-vision.md` の構成に倣う:

- 背景・目的 / 目標 / 新旧マッピング表 / フェーズ分けしたマイルストーン / 注意事項
- 効果測定があるなら Before を先に計測する(例: バンドルサイズ)

### 3. 新実装を用意し、旧実装と並走させる

- 旧実装を消す前に新実装を作る。インターフェース(呼び出し元から見たシグネチャ)は極力維持し、内部だけすげ替える
- 新実装にはテストを先に書く(`.agents/skills/test-driven-development/SKILL.md`)

### 4. 呼び出し元を段階的に移行する

利用箇所リストの 1 単位(1 モジュール・1 機能)ごとに:

1. 呼び出し先を新実装に切り替える
2. `pnpm vitest run` と `pnpm run build` が green であることを確認
3. コミット(1 ステップ = 1 コミット。`.agents/skills/git-workflow-and-versioning/SKILL.md`)

### 5. 旧実装を削除する

全呼び出し元の移行後:

```bash
rg -n "<旧シンボル/旧パッケージ>" src utils package.json   # 参照ゼロを確認
pnpm remove <旧パッケージ>                                  # 依存の場合
```

旧コード・旧テスト・vite.config.ts 等のワークアラウンド・型定義も併せて削除する。

### 6. 取り残しを検出する

```bash
pnpm run tsr                                    # 未使用 export の検出
pnpm run lint && pnpm run build && pnpm vitest run
```

tsr が報告した移行関連の未使用 export を削除してから完了とする。

## Hard rules

- **利用箇所を全列挙する前に削除しない**。「たぶん使われていない」での削除は禁止 — `rg` の結果(または callgraph)を根拠にする
- **1 ステップで全部移行しない**。差分をレビュー可能な大きさ(1 コミット = 1 呼び出し元グループ)に保つ
- 各ステップでテスト・ビルドが green であることを確認してから次に進む(red のまま積み上げない)
- 移行のついでに無関係なリファクタを混ぜない(別 PR にする)
- 動的参照(文字列キー・glob import・ルーティング規約)は `rg` で漏れるため、削除後の `pnpm run build` と主要ルートの表示確認まで行う

## 完了チェックリスト

- [ ] 利用箇所リスト(path:line)を作成してから着手した
- [ ] 各移行ステップが green のままコミットされている
- [ ] 旧実装・旧テスト・旧依存・関連ワークアラウンドをすべて削除した
- [ ] `rg` で旧シンボル・旧パッケージへの参照がゼロ
- [ ] `pnpm run tsr` で移行に伴う未使用 export が残っていない
- [ ] `pnpm run lint && pnpm run build && pnpm vitest run` が green
