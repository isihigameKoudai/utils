# Security Checklist(クライアントサイド SPA)

このリポジトリ向けのセキュリティチェックリスト。`.agents/skills/security-and-hardening/SKILL.md` から委譲される深掘り資料。

## 前提:このアプリの脅威モデル

- **クライアントサイドのみの SPA**(React 19 + Vite、Vercel 配信)。サーバコード・DB・認証基盤は存在しない
- したがって SQL インジェクション・セッション管理・サーバサイド SSRF は対象外
- 主戦場は: **バンドルに埋まるシークレット / XSS / 外部 API レスポンスの未検証利用 / 依存サプライチェーン / git 履歴**
- 外部との接点: Gemini API(`@google/genai`)、GMO・Binance API(vite dev proxy `/gmo`, `/binance` 経由)、MediaPipe / TensorFlow.js のモデル取得

## 1. シークレット・API キー(最重要)

**`VITE_` prefix の環境変数はすべてバンドルに埋め込まれ、誰でも閲覧できる。** `import.meta.env.VITE_*` は「公開してよい値」専用。

- [ ] `VITE_` env に秘匿すべき値(課金されうる API キー等)が入っていないか

```bash
# ソース中の env 参照を列挙
rg -n "import\.meta\.env" src utils

# ビルド成果物にキーらしき文字列が埋まっていないか確認
pnpm run build
rg -o "AIza[0-9A-Za-z_-]{30,}" dist/ 2>/dev/null   # Google API キーの形式
```

- [ ] Gemini(`@google/genai`)をクライアントから直接呼ぶ場合、その API キーは公開前提になる。キーに **使用量上限・リファラ制限(Google Cloud Console)** を設定しているか。個人実験リポジトリでも課金キーを無制限で晒さない
- [ ] `.env` / `.env.local` が `.gitignore` に入っているか(`rg -n "^\.env" .gitignore`)
- [ ] `.env.example` を置くならプレースホルダのみ

## 2. git 履歴への秘密混入

コミット前チェック(husky pre-commit は lint-staged のみで秘密検知はしない):

```bash
# ステージ済み差分にキーらしき文字列がないか
git diff --cached | rg -i "api[_-]?key|secret|token|password"

# 履歴に混入していないか(発覚した場合はキーの無効化が先、履歴書き換えは後)
git log -p --all -S "AIza" -- . | head -50
```

- [ ] 一度 push したキーは「漏洩済み」。履歴削除ではなく **キーのローテーション** で対処する

## 3. XSS / DOM への出力

React の JSX は既定でエスケープされる。穴になるのは以下のみ:

- [ ] `dangerouslySetInnerHTML` を使っていないか(`rg -n "dangerouslySetInnerHTML" src utils`)。LLM(Gemini)の出力を HTML として描画するのは典型的な事故パターン。Markdown を描画したい場合もテキストとして扱うか、サニタイズを通す
- [ ] `element.innerHTML` / `insertAdjacentHTML` への代入がないか(`rg -n "innerHTML|insertAdjacentHTML" src utils`)。canvas / three.js 系ユーティリティで DOM を直接触る箇所は特に確認
- [ ] `href` / `src` にユーザ・外部由来の URL を入れる場合、`javascript:` スキームを弾いているか
- [ ] URL クエリパラメータ(TanStack Router の search params)を valibot で検証してから使っているか

## 4. 外部データの valibot 検証

外部 API(GMO / Binance / Gemini)のレスポンスは信頼境界の外。`as Type` でキャストせず valibot でパースする。

```typescript
import * as v from 'valibot';

const TickerSchema = v.object({
  symbol: v.string(),
  last: v.pipe(v.string(), v.transform(Number), v.finite()),
});

const result = v.safeParse(TickerSchema, await res.json());
if (!result.success) return undefined; // 想定内の失敗は throw しない(AGENTS.md)
```

- [ ] `fetch(...).json()` の結果を `as` キャストで素通ししていないか(`rg -n "\.json\(\)\s*as " src utils`)
- [ ] `localStorage` から読んだ値も同様に検証しているか(他タブ・古いバージョンが書いた値は信頼できない)
- [ ] LLM 出力を `JSON.parse` する場合、パース後に valibot を通しているか(構造は保証されない)
- [ ] 型の絞り込みには `utils/guards.ts` / `utils/is.ts` の型ガードを使う

## 5. 依存サプライチェーン

```bash
pnpm audit                          # 既知 CVE の監査
pnpm audit --audit-level=high       # high 以上のみ
pnpm outdated                       # 更新漏れの確認
```

- [ ] `pnpm-lock.yaml` がコミットされているか(改竄・typosquat 検知の前提)
- [ ] 新規依存の追加時: メンテ状況・ダウンロード数・`postinstall` スクリプトの有無を確認(`pnpm audit` は悪意あるパッケージを検知しない)
- [ ] typosquat に注意(`lodash-es` vs `lodashes` 等)。追加は必ず `pnpm add`、npm/yarn は使わない
- [ ] AGENTS.md の方針通り、依存追加は必要最小限。three.js / TensorFlow.js 級の重い依存は既存のもので賄えないか先に確認

## 6. vite proxy と CORS

`vite.config.ts` の proxy(`/gmo`, `/binance`)は **dev サーバ専用**。

- [ ] proxy 前提のコードが本番(Vercel)で動く経路を確認したか(本番では vercel.json の rewrites か直接 CORS アクセスが必要)
- [ ] proxy 先の追加は `utils/apis/config.ts` の `apiMap` に閉じているか(任意 URL を中継する汎用 proxy にしない)

## 7. デバイス・権限系 API

カメラ(Detection / MediaPipe)・マイク(Audio)を使う feature がある。

- [ ] `getUserMedia` の権限拒否を明示的にハンドリングしているか(失敗時は `undefined`/`null` 返却方針)
- [ ] 取得した映像・音声をページ外(外部 API)へ送る場合、その旨が UI 上で自明か

## レビュー時の grep 早見表

```bash
rg -n "dangerouslySetInnerHTML|innerHTML" src utils      # XSS 面
rg -n "import\.meta\.env" src utils                       # 公開される env
rg -n "\.json\(\)\s*as |as unknown as" src utils          # 未検証キャスト
rg -n "localStorage|sessionStorage" src utils             # 永続化と信頼境界
pnpm audit                                                # 依存 CVE
```

## 関連

- 手順・脅威モデリングの進め方: `.agents/skills/security-and-hardening/SKILL.md`
- 外部データを扱う実装の検証手順: `.agents/skills/test-driven-development/SKILL.md`
