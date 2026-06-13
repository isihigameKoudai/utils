# Orchestration Patterns(Claude Code / Agent ツール)

Claude Code で subagent(Agent ツール)をいつ・どう使うかのパターン集。`.agents/skills/context-engineering/SKILL.md` や各ペルソナ(`.agents/agents/`)から参照される。

## 前提:このリポジトリでの実態

- オーケストレータは **メインセッション(あなた)とユーザ**。専用のオーケストレータエージェントは存在しない
- 委譲手段は **Agent ツール** のみ。subagent は結果レポートをメインに返すだけで、subagent 同士は会話しない。subagent はさらに subagent を生成できない(プラットフォーム制約)
- 利用できる subagent:
  - 組み込み: `Explore`(読み取り専用探索)/ `Plan`(実装計画)/ `general-purpose`(探索 + 編集)
  - このリポジトリのペルソナ: `.agents/agents/code-reviewer.md` / `security-auditor.md` / `test-engineer.md` / `web-performance-auditor.md`(system prompt として読み込んで使う)
- CI は無い。検証はローカルの `pnpm vitest run` / `pnpm run lint` / `pnpm run build` と Chrome DevTools(MCP)で行う

## 大原則

1. **探索は委譲、編集は本体。** 大量のファイルを読む作業は subagent に出し、メインの context にはダイジェストだけを残す。コードの編集はメインセッションで行う(編集の文脈・責任を分散させない)
2. **委譲したら自分で重複捜索しない。** 同じ grep をメインでも走らせるのは二重コスト
3. **1 subagent = 1 観点 = 1 レポート。** 複数の役割を 1 つの prompt に詰めない
4. **委譲しないのが最安。** 読むファイルが特定できている単発の確認は、Read / rg で直接やる

## パターン

### 1. 委譲しない(デフォルト)

対象ファイルが特定できていて、読む量が少ない場合。

- 「`utils/array/array.ts` の `splitMap` の仕様を確認」→ Read で直接
- 「この diff をレビュー」(数ファイル)→ メインセッションで直接

判断基準: **結果よりも読む量が小さいなら直接、読む量が膨大で結論だけ欲しいなら委譲。**

### 2. 探索の委譲(Explore)

「どこにあるか分からない」「複数の命名規約を横断して洗う」作業。読み取り専用の `Explore` を使う。

使いどころの例:

- 「`dispose` を呼んでいない three.js リソース生成箇所を `src/features/` 全体から洗い出す」
- 「`import.meta.env` の参照箇所をすべて列挙」
- 「features 間 import(`features/A` → `features/B`)違反がないか全域確認」

prompt に含めるもの:

- 探索範囲(`utils/` / `src/features/Noise/` 等)と除外(`*.test.ts`, `src/generated/`)
- 期待する出力形式(**path:line の一覧 + 1 行要約**。ファイル全文の転記は不要と明記)
- 探索の深さ(「medium」「very thorough」)

### 3. 反証レビュー用 subagent(セルフレビューの分離)

自分が書いた変更を、**実装の文脈を持たない別 context** にレビューさせる。実装した本人(メインセッション)は自分の前提を疑えないため、粗探し専用の subagent を立てる価値がある。

```
メイン: 実装 + テスト
  └→ subagent(code-reviewer ペルソナ + git diff): 「この変更を壊す入力・違反規約を探せ」
  └→ レポートをメインで取捨選択し、メインが修正
```

prompt の要点:

- `.agents/agents/code-reviewer.md`(または security-auditor 等)の観点で見ることを指示
- 「擁護ではなく反証」を明示: 壊れる入力、依存方向違反、テストの抜けを探させる
- 出力は **path:line + 重要度 + 根拠**(ペルソナの出力フォーマットに従う)
- 修正は subagent にさせない。指摘だけ受け取り、採否と修正はメインで行う

### 4. 並列ファンアウト(独立した観点の同時実行)

同じ diff に対して独立した観点を並列で走らせ、メインでマージする。**1 つのメッセージ内で複数の Agent 呼び出しを同時に発行する**(順番に呼ぶと直列になる)。

```
メイン ─┬→ code-reviewer(規約・正しさ)
        ├→ security-auditor(env 露出・XSS・未検証キャスト)
        └→ test-engineer(カバレッジの穴)
        → メインでマージ → 修正
```

採用前チェック:

- [ ] 各観点は本当に独立か(順序依存・共有状態がない)
- [ ] 各レポートは異なる**種類**の指摘を返すか(同じ指摘を 3 通もらうだけなら 1 つでよい)
- [ ] マージ判断はメインの残り context に収まるか

リリース前の総点検など重い節目に限る。日常の小さい diff には過剰。

### 5. 検証の委譲(ブラウザ確認)

単体テストで証明できない描画・操作(shader 出力、検出系のオーバーレイ、オーディオビジュアライザ)は、Chrome DevTools MCP を持つ subagent に「起動 → 操作 → スクリーンショット/トレース取得 → 所見」を委譲できる。手順は `.agents/skills/browser-testing-with-devtools/SKILL.md` に従わせる。

## アンチパターン

| アンチパターン | なぜ駄目か | 代わりに |
|---|---|---|
| ルーター agent(どの agent を呼ぶか決めるだけの agent) | 言い換えホップが増えるだけで情報が落ちる | メイン(あなた)が直接判断して委譲する |
| subagent に編集まで任せて放置 | 規約違反・スコープ逸脱に気付けない | 探索・指摘は委譲、編集はメイン |
| 委譲後に同じ探索をメインでも実行 | 二重コスト | レポートを待つ |
| 1 prompt に「レビューして直してテストも書いて」 | 観点が混ざり、どれも浅くなる | 1 subagent 1 観点に分割 |
| 逐次に Agent を呼んで「並列」のつもり | 直列実行になる | 1 メッセージで複数 Agent 呼び出し |
| subagent のレポートを鵜呑みで全採用 | 誤検出・規約誤解が混ざる | path:line の根拠をメインで検証して採否判断 |
| 数行の確認を委譲 | 往復コスト > 直接読むコスト | Read / rg で直接 |

## 委譲 prompt のテンプレート

subagent はこの会話の文脈を持たない。毎回ゼロから伝える:

```
1. 役割: .agents/agents/<persona>.md の観点で(または Explore として)
2. 対象: 範囲(path)、除外(*.test.ts, src/generated/ 等)
3. このリポジトリの前提: pnpm のみ / typestyle(Tailwind 不使用)/
   依存方向 routes → features → components → utils / クライアントのみ SPA
4. やること・やらないこと: 「指摘のみ、編集禁止」等
5. 出力形式: path:line + 重要度(Critical/Important/Suggestion)+ 根拠
```

## 判断フロー

```
読むファイルは特定済みで少量か?
├── Yes → 委譲しない(パターン 1)
└── No  → 読み取りだけで足りるか?
         ├── Yes → Explore に委譲(パターン 2)
         └── No  → 自分の変更の粗探しか?
                  ├── Yes → 反証レビュー subagent(パターン 3)
                  └── No  → 独立した複数観点が必要か?
                           ├── Yes → 並列ファンアウト(パターン 4)
                           └── No  → general-purpose に単発委譲
```

## 関連

- ペルソナ一覧と使い分け: `.agents/agents/README.md`
- context を汚さない働き方全般: `.agents/skills/context-engineering/SKILL.md`
- ブラウザ検証の手順: `.agents/skills/browser-testing-with-devtools/SKILL.md`
