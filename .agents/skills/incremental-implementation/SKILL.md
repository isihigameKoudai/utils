---
name: incremental-implementation
description: 機能を薄い縦切りスライスに分割し、スライスごとにテスト・lint・動作確認を回して常に green の状態で積み上げる。複数ファイルにまたがる実装や、テストなしで大量のコードを書きそうになったときに使用する。単一ファイル・単一関数で完結する最小変更には使わない。
---

# Incremental Implementation

## ゴール

- どのスライス完了時点でも `pnpm vitest run` / `pnpm run lint` / `pnpm run build` が通る状態を維持する
- 最初のスライスで「エンドツーエンドで貫通する最小経路」を通し、方向の誤りを最初に検出する
- diff に依頼範囲外の変更が一切含まれない(AGENTS.md「Implement exactly what's requested—no extra features」)

## このリポジトリでの検証コマンド

```bash
pnpm vitest run utils/array/array.test.ts   # スライスごと: 対象ファイルのみ
pnpm run lint                                # ESLint(auto-fix)
pnpm vitest run                              # 全件回帰(完了前に必ず)
pnpm run build                               # tsc + Vite build(完了前に必ず)
```

## 手順

### 1. スライスを切る

- **Slice 1 は必ず貫通経路**: 新 feature なら `src/routes/<x>.tsx` → `src/features/<X>/pages/` の最小ページが表示されるまでを 1 本通す。ロジックの作り込みは後のスライス
- 以降のスライスは 1 つにつき 1 つの論理的変更(機能追加とリファクタを混ぜない)
- 不確実・高リスクな部分(WebGL シェーダ、@mediapipe/tasks-vision、@google/genai 等の外部 API)は最小コードで先に検証する。失敗するならスライス 1 で発覚させる
- 依存方向 `routes → features → components → utils` を崩すスライスを作らない(`features/A → features/B` も禁止)
- `utils/` への抽出は「再利用が実際に必要になった」スライスでのみ行う。先回りで汎用化しない

### 2. スライスごとのサイクル

1. **Implement**: 最小の完結した変更を書く(目安: テストなしで ~100 行を超えない)
2. **Test**: `pnpm vitest run <対象ファイル>`(ロジック変更ならテストを先に → `.agents/skills/test-driven-development/SKILL.md`)
3. **Lint**: `pnpm run lint`
4. **動作確認**: ブラウザでしか確認できない挙動(描画・操作)は `pnpm run dev` で確認 → `.agents/skills/browser-testing-with-devtools/SKILL.md`
5. green を確認してから次のスライスへ。壊れたまま先に進まない

### 3. 完了前の全体確認

`pnpm vitest run` → `pnpm run lint` → `pnpm run build` をすべて実行し、出力を確認する。

## スコープ外に気づいたとき

直さず、メモして報告のみ:

```
NOTICED BUT NOT TOUCHING:
- utils/format.ts に未使用 import がある(本タスクと無関係)
→ 別タスクにしますか?
```

## Hard rules

- 頼まれていないリファクタをしない。隣接コードの「ついで」清掃・import 整理・構文のモダン化をしない
- 完全に理解していないコメントを削除しない
- 仕様にない機能を「便利そう」という理由で追加しない
- テストなしで ~100 行を超えるコードを書き続けない
- スライス間でテスト・ビルドが壊れた状態を放置しない
- 抽象化は 3 回目の使用例が出てから。3 行の重複 > 早すぎる抽象化
- コードに変更がないのに同じ検証コマンドを繰り返さない(確認は 1 回で足りる)

## 完了チェックリスト

- [ ] Slice 1 がエンドツーエンドで貫通していた
- [ ] 各スライスが個別に `pnpm vitest run <対象>` + `pnpm run lint` を通過した
- [ ] 完了前に `pnpm vitest run` / `pnpm run lint` / `pnpm run build` がすべて green(出力を確認した)
- [ ] diff に依頼範囲外の変更が含まれていない
- [ ] 依存方向違反(逆流・feature 間 import)を作っていない
- [ ] スコープ外の気づきは「NOTICED BUT NOT TOUCHING」で報告のみ
