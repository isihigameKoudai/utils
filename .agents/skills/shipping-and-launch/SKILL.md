---
name: shipping-and-launch
description: Vercel 前提のリリース手順(ローカルゲート → preview 確認 → merge → 本番確認 → 必要ならロールバック)を強制する。変更を main にマージして本番へ出すときに使用する。実装途中のコミットや push しない作業では不要。
---

# Shipping and Launch

## ゴール

- main へのマージ = 本番デプロイ、を安全に行う(確認済みのものだけが本番に出る)
- 問題発生時に Vercel の deployment 履歴から即座に戻せる状態を保つ

## このリポジトリでの前提

- デプロイは Vercel(`vercel.json` あり)。**push で自動デプロイ**され、PR には preview deployment が付く。main マージで本番反映
- ステージング環境・feature flag 基盤は無い。「PR の preview deployment」が事実上のステージング
- ロールバックは Vercel ダッシュボードの deployment 履歴から過去デプロイに戻す(コード revert より速い)
- npm 公開はしていないため、バージョンタグや changelog の作業は不要

## 手順

### 1. ローカルゲートを通す

```bash
pnpm run lint && pnpm run build && pnpm vitest run
```

詳細は `.agents/skills/ci-cd-and-automation/SKILL.md`。

### 2. 本番ビルドをローカルで確認する

```bash
pnpm run build && pnpm run preview
```

`pnpm run dev` と本番ビルドは挙動が異なり得る(ビルド最適化・チャンク分割・アセット解決)。preview で実際に開いて確認する。

確認観点:

- ブラウザ console にエラーがゼロであること
- 変更に関係する主要ルートが表示・動作すること
- 視覚的な feature(描画・Canvas・検出系)はスクリーンショットを取り、変更前後を見比べる

### 3. PR を出し、preview deployment で確認する

```bash
git push -u origin feature/<name>
gh pr create --base main --title "..." --body "..."
```

Vercel が PR に preview URL を付ける。**preview URL 上で手順 2 と同じ観点を再確認する**(ローカル preview で通っても、Vercel 環境の差異で壊れることがある)。

### 4. merge → 本番確認

merge 後、本番 URL で:

1. 主要ルートを開き、console エラーがないことを確認
2. 今回変更した機能を実際に操作して確認

### 5. 問題があればロールバック

1. Vercel ダッシュボード → 対象プロジェクト → Deployments
2. 直前の正常な deployment を選び「Promote to Production」(Instant Rollback)
3. その後、原因をコードで修正して通常フローで再リリース(ロールバックは応急処置であり修正ではない)

## Hard rules

- **preview(ローカル `pnpm run preview` + PR の preview deployment)で確認していないものを merge しない**
- console エラーが出ている状態で「動作確認 OK」としない
- ロールバックしたまま放置しない — 原因修正の PR まで含めて完了とする
- 確認は変更箇所だけでなく、ビルド全体に影響し得る変更(依存追加・vite.config.ts・tsconfig)では主要ルートを一通り開く

## 完了チェックリスト

- [ ] ローカルゲート 3 コマンドが green
- [ ] `pnpm run preview` で本番ビルドを実際に開いて確認した
- [ ] PR の preview deployment 上でも確認した(console エラーゼロ・主要ルート表示)
- [ ] 視覚的な変更はスクリーンショットで確認した
- [ ] merge 後、本番 URL で動作確認した
- [ ] (問題発生時)Vercel の deployment 履歴からロールバックし、修正 PR を作成した
