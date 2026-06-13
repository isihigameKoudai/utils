---
name: code-simplification
description: 挙動を一切変えずにコードを単純化する（不要な抽象化の解体・未使用 export の削除・300 行超ファイルの分割）。動いているが読みにくい・重いと感じるコードの整理時に使用する。バグ探しはしない — それは code-review-and-quality の領分。
---

# Code Simplification

## ゴール

- 挙動を完全に保存したまま、理解・変更・デバッグが容易なコードにする。行数削減自体は目的でない
- 「新しいメンバーが元のコードより速く理解できるか」を全変更の合格基準にする

## このリポジトリでの前提

- TypeScript strict / ファイル 300 行以内・単一目的（AGENTS.md）
- テストは実装と同じディレクトリの `*.test.ts`。挙動保存の証明は `pnpm vitest run`
- 未使用 export の検出ツールがある: `pnpm run tsr`（ts-remove-unused、tsconfig.src.json 基準）
- React Compiler 未導入だが、useMemo/useCallback の追加・削除は計測の話なのでここでは触らない → `.agents/skills/performance-optimization/SKILL.md`

## 手順

### 1. 変更前のベースラインを取る

```bash
pnpm vitest run    # green であることを確認。red なら単純化を始めない
```

対象コードの責務・呼び出し元・エッジケースを把握してから触る（Chesterton's Fence: なぜこう書かれたか説明できないなら、まだ削る資格がない。`git log -p <file>` で経緯を見る）。

### 2. 単純化の対象を見つける

| シグナル | 対応 |
|---|---|
| 300 行超のファイル | 単一目的のモジュールに分割 |
| 3 階層超のネスト・ネストした三項演算子 | guard clause / if-else / lookup へ |
| 利用箇所が 1 つしかない抽象化（factory・wrapper・strategy） | インライン化して直接呼ぶ（YAGNI: 「後で使うかも」は複雑さの言い訳。必要になったら再追加すればよい） |
| `data` / `result` / `temp` 等の汎用名 | 内容を表す名前へ（リネームは規約準拠: camelCase / PascalCase / UPPER_SNAKE_CASE） |
| 重複ロジック（5 行以上 × 複数箇所） | 共有関数へ抽出。`utils/` に既存の同等品（`guards.ts`, `is.ts`, `array` 等）がないか先に確認 |
| 未使用 export・dead code | 手順 3 で機械的に検出して削除 |

### 3. 未使用 export の削除

```bash
pnpm run tsr                      # 候補を列挙（dry run）
rg "シンボル名" --type ts          # 削除前に参照ゼロを必ず rg で確認
```

tsr は tsconfig.src.json のエントリ基準なので、`utils/` の公開 API として意図的に残す export は誤検出になり得る。rg で参照ゼロを確認できたものだけ削除する。

### 4. 1 件ずつ適用して都度テスト

```
変更 1 件 → pnpm vitest run → green なら次へ / red なら revert
```

複数の単純化を未検証のままバッチしない。壊れたときどれが原因か分からなくなる。

### 5. 仕上げ

```bash
pnpm vitest run && pnpm run lint && pnpm run build
```

差分を見直す: 本当に読みやすくなったか。元より長く・難しくなったなら revert する。失敗する単純化もある。

## Hard rules

- **挙動保存が絶対条件**。入力・出力・副作用・エラー挙動・順序のすべてが同一。変更前後で `pnpm vitest run` green を確認する
- テストを書き換えないと通らない「単純化」は挙動変更。やめて revert する
- バグを見つけても直さない。記録して報告し、修正は別タスク（→ `.agents/skills/code-review-and-quality/SKILL.md` / `.agents/skills/test-driven-development/SKILL.md`）
- エラーハンドリングを「すっきりするから」で削らない。expected failure の `undefined`/`null` 返却方針も維持する
- スコープは最近変更されたコードに限定。頼まれていない drive-by リファクタをしない
- 名前を付ける価値のある概念を過剰にインライン化しない。2 つの単純な関数を 1 つの複雑な関数にまとめるのは単純化ではない
- リファクタと機能追加を同じコミットに混ぜない
- 「動いているから触らない」は読みにくいまま壊れる日を待つだけ。ただし理解していないコードを単純化するのはもっと悪い — 先に読む

## 完了チェックリスト

- [ ] 変更前に `pnpm vitest run` が green だった（ベースライン確認）
- [ ] 変更後も `pnpm vitest run` が green（テストは無修正）
- [ ] `pnpm run lint` と `pnpm run build` が通る
- [ ] 削除した export は `pnpm run tsr` + `rg` 参照ゼロ確認済み
- [ ] 300 行超のファイルが残っていない（残した場合は理由を報告）
- [ ] 差分に無関係な変更が混ざっていない
- [ ] 見つけたバグ疑いは（直さずに）報告に記載した
