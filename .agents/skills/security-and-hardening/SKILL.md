---
name: security-and-hardening
description: クライアントサイド SPA であるこのリポジトリで実際に起きうる脆弱性（API キーのバンドル混入・XSS・外部入力の未検証・依存の脆弱性）を点検・修正する。シークレットを扱うコード、外部 API 連携、dangerouslySetInnerHTML、依存追加の前後で使用する。サーバサイドの脅威（SQLi・セッション管理・SSRF 等）はこのリポジトリには存在しないので扱わない。
---

# Security and Hardening

## ゴール

- バンドル・git 履歴・ログのどこにもシークレットが存在しない状態にする
- 外部から来るデータ（API レスポンス・URL パラメータ）がすべて valibot で検証されてから使われる状態にする

## このリポジトリでの前提

- **クライアントサイドのみの SPA（サーバなし）**。コードと環境変数はすべてユーザーのブラウザに配信される — 「隠せるシークレット」は存在しない
- @google/genai（Gemini）を使用 → API キーの扱いが最大のリスク
- 外部 API は vite proxy 経由（`/gmo`, `/binance`）。dev proxy は本番では存在しないことに注意
- バリデーションは valibot。branded types は `utils/branded`
- 汎用チェックリスト（OWASP 全項目等）は `.agents/references/security-checklist.md` に委譲。本スキルはこのリポジトリで現実に起きるものだけを扱う

## 手順

### 1. シークレットのバンドル / コミット混入チェック

**事実: `VITE_` prefix の環境変数は `import.meta.env` 経由でバンドルに埋め込まれ、全ユーザーに公開される。** Gemini の API キーを `VITE_GEMINI_API_KEY` にした時点で公開済みと同じ。個人サンドボックスとして許容するなら、キーに使用量上限・API 制限（HTTP referrer 等）を必ず設定する。

```bash
# ソース内のキー直書き・疑わしい文字列
rg -i "api[_-]?key|secret|token" src/ utils/ --type ts -g '!*.test.ts'
# import.meta.env の利用箇所を列挙し、何が公開されるか把握する
rg "import\.meta\.env" src/ utils/
# ビルド成果物にキーが漏れていないか（ビルド後）
pnpm run build && rg -i "AIza" dist/   # Gemini キーは AIza で始まる
# git 履歴への混入チェック
git log -p --all -S "AIza" -- . | head -50
```

**一度でもコミットされたキーは漏洩済みとして扱い、ローテーションする。** 履歴の書き換えやファイル削除では戻らない。

### 2. XSS / DOM 注入

React の JSX は既定でエスケープされる。危険になるのは明示的にバイパスした箇所のみ。

```bash
rg "dangerouslySetInnerHTML|innerHTML|insertAdjacentHTML" src/ utils/
```

- `dangerouslySetInnerHTML` に外部由来文字列（API レスポンス・URL パラメータ・LLM 出力）を渡さない。どうしても必要なら sanitize してから
- Gemini の出力もユーザー入力と同格の未信頼データ。`innerHTML` / `eval` / URL に直接流さない

### 3. 外部入力の valibot 検証

trust boundary はこの SPA では 2 つ: **外部 API レスポンス**（/gmo, /binance, Gemini）と **URL（パス・クエリパラメータ）**。

```bash
# fetch 箇所を列挙し、レスポンスが parse されているか確認
rg "fetch\(|axios" src/ utils/ --type ts
rg "v\.parse|v\.safeParse|parse\(.*[Ss]chema" src/ --type ts
```

- 外部レスポンスは `as SomeType` でキャストせず、valibot スキーマで `safeParse` する。失敗時は方針どおり throw せず `undefined`/`null` を返す
- ID 等の検証済み値は `utils/branded` の branded types で「検証済み」を型に刻む

### 4. 依存の最小化と監査

```bash
pnpm audit                # 既知 CVE。critical/high は対応してから報告
git diff main -- package.json   # 差分レビューで依存追加を検出
```

- 依存追加は最終手段。既存スタック（lodash-es, valibot, `utils/`）で解けないか先に確認する
- `pnpm audit` は既知 CVE しか捕まえない。新規依存は typosquat（`crossenv` 等）・postinstall スクリプト・メンテ状況を目視確認する
- lockfile（pnpm-lock.yaml）の差分が package.json の差分と整合しているか見る

## Hard rules

- 「dev proxy があるから安全」と判断しない。proxy はビルド成果物には存在せず、本番ではブラウザが直接外部 API を叩く。CORS とキー露出を本番構成で考える
- 「個人プロジェクトだから」を脆弱性放置の理由にしない。公開リポジトリのコミット履歴は bot が常時走査しており、漏れたキーは数分で悪用される
- クライアントサイドの検証は UX のためであってセキュリティ境界ではない — ただしこのリポジトリにはサーバがないため、検証の目的は「外部データの壊れた形からアプリを守ること」。だからこそ valibot 検証は省略不可
- 一度コミットされたシークレットは必ずローテーション。履歴削除で済ませない
- 出力本文は日本語。識別子・パス・コマンドは原文のまま

## 出力フォーマット

````
SECURITY CHECK
==============

対象: <branch / 差分 / feature 名>
実行: pnpm audit=<結果要約>

## 指摘
- [blocker] <path:line> — <問題> / 影響: <何が漏れる・何が起きる> / 対処: <具体策>
- [should]  <path:line> — ...

## 確認済み（問題なし）
- シークレット混入: <チェック方法と結果>
- dangerouslySetInnerHTML / innerHTML: <件数と判定>
- 外部入力検証: <未検証 fetch の有無>

## 要ローテーション
- <漏洩・混入が確認されたキーがあれば>
````

## 完了チェックリスト

- [ ] `rg` でシークレット直書き・`import.meta.env` 利用箇所を確認した
- [ ] dangerouslySetInnerHTML / innerHTML の全使用箇所を確認した
- [ ] 新規・変更された fetch に valibot 検証がある
- [ ] `pnpm audit` を実行し、critical/high がゼロまたは指摘に記載した
- [ ] コミット予定の差分にシークレットが含まれない（`git diff` を目視）
- [ ] 汎用項目は `.agents/references/security-checklist.md` を参照した（必要時）
