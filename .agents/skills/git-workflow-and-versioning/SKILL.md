---
name: git-workflow-and-versioning
description: このリポジトリの git 運用(feature ブランチ → main への PR、atomic commit、pre-commit hook との付き合い方)を規律として強制する。コミット・ブランチ作成・PR 作成を行うときに使用する。コードを書くだけで履歴に触れない場面では不要。
---

# Git Workflow and Versioning

## ゴール

- 1 コミット = 1 論理変更(atomic commit)の履歴を保ち、いつでも安全に revert できる状態にする
- main を常にデプロイ可能(= Vercel 本番に出せる状態)に保つ

## このリポジトリでの前提

- 個人リポジトリ(isihigameKoudai/utils)。`feature/*` ブランチで作業し、main へ PR を出す(`gh` CLI 利用可)
- husky の pre-commit で lint-staged(`eslint --fix` + `prettier`)が**自動実行され、ステージ内容が書き換えられることがある**
- コミットメッセージの実態は**短い英語命令形**(例: `add callgraph`, `fix gemini bug`, `refactor model`, `migrate to valibot`)。長文 body や `feat:` プレフィックスは使われていない。この実態に合わせる
- npm 公開はしていない(`private: true`)。semver タグや CHANGELOG の管理は不要

## 手順

### 1. ブランチを切る

```bash
git switch main && git pull
git switch -c feature/<short-description>   # 例: feature/add-embedding
```

### 2. 小さく刻んでコミットする

増分実装ごとに「テスト green → コミット」を繰り返す(セーブポイント)。
品質ゲートは `.agents/skills/ci-cd-and-automation/SKILL.md` 参照。

```bash
git status                       # untracked を含め、何があるか必ず確認
git add <意図したファイルのみ>      # パスを明示する
git diff --staged                # コミット内容を目視確認
git commit -m "add vector math"  # 短い英語命令形
```

### 3. コミット後に hook の書き換えを確認する

pre-commit の lint-staged が整形を加えた可能性があるため、コミット直後に確認する:

```bash
git show --stat HEAD   # コミットに入った内容の最終確認
git status             # hook 後に未ステージの差分が残っていないか
```

差分が残っていれば内容を確認し、意図どおりなら追いコミット(または `git commit --amend`、ただし push 前のみ)。

### 4. PR を出す

```bash
git push -u origin feature/<name>
gh pr create --base main --title "<英語の短い要約>" --body "<変更の要点>"
```

PR 前に preview deployment での確認手順は `.agents/skills/shipping-and-launch/SKILL.md` を参照。

## コミット分割の規律

- 変更種別を混ぜない: リファクタと機能追加、整形と挙動変更は別コミット
- 目安: 1 コミット ~100 行、1 PR で 1000 行を超えるなら分割を検討
- メッセージは diff から自明な「what」の繰り返しではなく、変更の単位が分かる動詞始まりにする

## Hard rules

- **main へ直接 push しない**。必ず `feature/*` → PR 経由
- **force push しない**(`--force` / `--force-with-lease` とも、ユーザーの明示指示がない限り禁止)
- **`git add -A` / `git add .` を使わない**。このリポジトリは `.agents/` 等の untracked ファイルが多く、無関係ファイルが混入する。必ずパスを明示してステージする
- **ユーザーの指示なしに commit / push しない**。作業完了 ≠ コミット許可
- push 済みコミットを `--amend` / rebase で書き換えない
- secrets(API key 等)が diff に含まれていないか `git diff --staged` で確認してからコミットする

## 完了チェックリスト

- [ ] 各コミットが 1 論理変更で、メッセージは短い英語命令形
- [ ] `git diff --staged` で意図したファイルだけが入っていることを確認した
- [ ] コミット後に `git status` で hook による残差分がないことを確認した
- [ ] main ではなく `feature/*` ブランチ上にいる
- [ ] commit / push はユーザーの指示に基づいている
