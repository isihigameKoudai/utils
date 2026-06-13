---
name: documentation-and-adrs
description: 変更に伴うドキュメントの「書く場所」と「書き方」を判断する(AGENTS.md / doc/plans / doc/adr / JSDoc)。規約変更・アーキテクチャ判断・utils 公開 API の追加変更を行うときに使用する。コードを読めば分かる内容の説明や、使い捨てコードの文書化には使わない。
---

# Documentation and ADRs

## ゴール

- **why が記録され、what はコードが語る**状態にする
- 将来の人間・エージェントが、過去の判断を再調査・再議論せずに済む

## このリポジトリでの前提

- **AGENTS.md = 規約の単一情報源**(ルートの `AGENTS.md` と `doc/AGENTS.md`)。規約を変えたら両方を同期させる
- `doc/plans/` = 実装・移行計画(実例: `doc/plans/benchmark-vite8.md`, `doc/plans/migrate-to-tasks-vision.md`)
- `doc/templates/` = コーディング/コンポーネント/テストのテンプレ
- **ADR 専用ディレクトリはまだ無い**。最初の ADR を書くときに `doc/adr/` を作成する
- utils/ の公開 API は **JSDoc + `@example` が規約**(AGENTS.md「Utility Functions」。実例: `utils/guards.ts`)

## 手順

### 1. 書く場所を判断する

| 書く内容 | 場所 | 形式 |
|---|---|---|
| 規約・コーディングルールの変更 | AGENTS.md(ルートと doc/AGENTS.md の両方) | 既存セクションへ追記 |
| 実装・移行計画 | `doc/plans/<topic>.md` | 自由形式 |
| アーキテクチャ判断 | `doc/adr/NNNN-<title>.md` | Context / Decision / Consequences |
| utils 公開 API の使い方 | コード内 JSDoc | `@example` 必須 |
| 非自明な実装の意図 | コード内コメント | why のみ |

### 2. ADR を書くか判断する

次のいずれかに該当したら ADR を書く。該当しなければ書かない:

- AGENTS.md の依存方向ルール(`routes → features → components → utils`)への**例外**を作る
- **ライブラリの選定・置換**(例: 状態管理の置換、エラー監視 SaaS の導入)
- **データ構造・公開 API シグネチャの大きな変更**

10 分で書けない ADR は、判断がまだ固まっていないサイン。先に判断を詰める。

### 3. utils 公開 API の JSDoc

```typescript
/**
 * falsy値(false, 0, "", null, undefined, NaN)を除外するための型ガード関数
 *
 * @example array.filter(isTruthy)
 */
```

- 1 行目に「何をするか」。`@example` は実際に動くコードを書く
- expected failure(throw せず `undefined`/`null` を返す方針)の関数は、失敗時に何が返るかを明記する

### 4. コメントは why のみ

```typescript
// BAD: コードの逐語訳
// カウンタを 1 増やす
counter += 1;

// GOOD: コードから読み取れない意図・制約
// Safari は AudioContext がユーザー操作前に suspended になるため、クリック時に resume する
```

罠(gotcha)は使う側が踏む場所に書く。「最初の render 前に呼ぶ必要がある」類の制約は JSDoc に残す。

## Hard rules

- **コードと矛盾するドキュメントを残さない**。コードを変えたら、該当する AGENTS.md / doc/ / JSDoc を同じ変更内で更新する
- 自明なコメント(コードの逐語訳)を書かない
- コメントアウトされたコードを残さない(履歴は git にある)
- 古い ADR を削除・改変しない。判断が変わったら新しい ADR で supersede し、旧 ADR の Status を更新する
- 本文は日本語。識別子・コマンド・パスは原文のまま

## 出力フォーマット(ADR)

`doc/adr/NNNN-<kebab-title>.md`(NNNN は 0001 からの連番):

```markdown
# NNNN: <決定内容を一文で>

- Status: Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context
<何が問題で、どんな制約があるか。検討した代替案と却下理由を含める>

## Decision
<採用した判断を一文で。続けて要点>

## Consequences
<この判断で得るもの・失うもの・追加で必要になる作業>
```

## 完了チェックリスト

- [ ] 規約に触れる変更は、ルート `AGENTS.md` と `doc/AGENTS.md` の両方に反映した
- [ ] ADR トリガー(依存方向の例外・ライブラリ選定・データ構造変更)に該当する判断は `doc/adr/` に記録した
- [ ] utils の新規・変更公開 API に JSDoc + `@example` がある
- [ ] コードと矛盾する記述・コメントアウトされたコード・逐語訳コメントが残っていない
