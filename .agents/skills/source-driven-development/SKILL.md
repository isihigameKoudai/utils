---
name: source-driven-development
description: 推測で API を使わず、package.json で確認したバージョンの公式ドキュメントに当たってから実装する。React 19 / TanStack Router / three.js / MediaPipe / @google/genai などライブラリ固有のコードを書く・レビューするときに使用する。バージョンに依存しない純粋ロジック(ループ・データ構造)やリネーム・ファイル移動には使わない。
---

# Source-Driven Development

## ゴール

- ライブラリ固有のコードがすべて「その版の公式ドキュメントで確認済み」の状態で完了する
- 非自明な API 選択に根拠(URL・該当箇所)が残り、ユーザーが検証できる
- 確認できなかった箇所が `UNVERIFIED` として明示されている

## なぜこのリポジトリで必須か

このリポジトリは更新の速いライブラリで構成されている: React 19(useActionState / Actions 等の新 API)、TanStack Router(file-based)、three.js / @react-three/fiber、@mediapipe/tasks-vision、@google/genai、valibot、typestyle。学習データには旧 API が大量に含まれる(例: 旧 `@google/generative-ai` SDK、MediaPipe の旧 solutions API、react-three-fiber の旧 props、React 18 以前のパターン)。**記憶で書いたコードは「正しく見えて現バージョンで壊れる」**。スタイリングは typestyle であり Tailwind ではない — クラス名ベースの提案をしない。

## 手順

### 1. バージョン確認

`package.json` を読み、対象ライブラリの正確なバージョンを特定する。バージョンが曖昧なら推測せずユーザーに確認する。

### 2. その版のドキュメントを引く

- **context7 MCP が利用可能なら最優先で使う**(AGENTS.md 方針)。ライブラリ名とステップ 1 のバージョンを指定して該当 API のドキュメントを取得する
- 利用不可なら公式ドキュメントの**該当ページ**を直接参照する。トップページや docs 全体ではなく、実装する機能のページをピンポイントで引く

| 優先度 | ソース |
|---|---|
| 1 | 公式ドキュメント(react.dev, tanstack.com/router, threejs.org/docs, ai.google.dev 等) |
| 2 | 公式 blog / changelog / migration guide |
| 3 | Web 標準リファレンス(MDN) |

Stack Overflow・ブログ記事・AI 生成の要約は一次ソースにしない。

### 3. 根拠を記録

確認した API について「URL + 該当箇所」を記録する。非自明な選択にはコードコメントまたは会話で引用を残す:

```typescript
// React 19: フォーム送信状態は useActionState で管理
// Source: https://react.dev/reference/react/useActionState#usage
```

### 4. 実装

- ドキュメントのシグネチャ通りに書く。記憶とドキュメントが食い違ったらドキュメントが正
- deprecated とされたパターンを使わない
- ドキュメントと既存コードのパターンが食い違う場合は、黙ってどちらかを選ばずユーザーに提示する(新パターン採用 / 既存コードに合わせる、の選択肢付きで)
- ドキュメントに載っていないパターンは実装前に `UNVERIFIED` と明示する

## Hard rules

- 存在を確認していないメソッド・props・オプションを書かない。「たぶんある」は書かない理由になる
- バージョン不一致のサンプルコードをコピーしない(例: React 18 向け記事のコード、旧 `@google/generative-ai` のスニペット)
- `package.json` を読む前にライブラリ固有のコードを書き始めない
- 確認できなかった箇所を確認済みのように報告しない。`UNVERIFIED: 公式ドキュメントで確認できず。学習データ由来のため要検証` と明示する
- 「~だと思います」で API を語らない。引用するか、UNVERIFIED と言うか、どちらか

## 完了チェックリスト

- [ ] 対象ライブラリのバージョンを `package.json` で確認した
- [ ] ライブラリ固有のパターンすべてについて context7 MCP または公式ドキュメントで確認した
- [ ] 非自明な選択に根拠(URL・該当箇所)を残した
- [ ] deprecated API を使っていない(migration guide と突き合わせた)
- [ ] ドキュメントと既存コードの食い違いはユーザーに提示した
- [ ] 確認できなかった箇所はすべて `UNVERIFIED` として明示した
