---
name: api-and-interface-design
description: このリポジトリの公開インターフェース — utils/ モジュールの公開 API・コンポーネント props・外部 API クライアント(utils/api, utils/apis)— を設計・変更するときに使用する。HTTP サーバのエンドポイント設計には使わない(このリポジトリにサーバは無い)。
---

# API and Interface Design

## ゴール

- 誤用しにくく、壊さずに拡張できるインターフェースを設計する
- 公開済みインターフェースの変更時に、全呼び出し元を確認してから変える

## このリポジトリでの前提

クライアントサイドのみの SPA で、**HTTP API サーバは無い**。設計対象は次の 3 つ:

1. **utils/ モジュールの公開 API** — `index.ts` から export される関数・型(例: `utils/array/index.ts` → `export * from './array'`)
2. **コンポーネント props** — `src/components/`(domain-agnostic)と `src/features/<X>/components/`
3. **外部 API クライアント** — `utils/api`(fetch ラッパ)、`utils/apis`(GMO/Binance、vite proxy `/gmo` `/binance` 経由)

Hyrum's Law: export した瞬間、観測可能な挙動すべてが事実上の契約になる。公開は意図的に最小限にする。

## utils/ 公開 API の設計規律

- 公開するものだけを `index.ts` から export する。内部ヘルパーは export しない
- **explicit return type** を必ず書く(推論任せにしない)
- JSDoc に `@example` を付ける(実例: `utils/array/array.ts`, `utils/branded/index.ts`)
- **expected failure(見つからない・パース不能等)は throw せず `undefined` / `null` を返す**。throw はプログラミングエラー(契約違反)のみ
- 引数は受け入れ寛容(optional + デフォルト値)、返り値は厳密(union を不用意に広げない)
- `utils/` → `src/` や app 固有ライブラリへの依存禁止(pure に保つ)。1 ファイル 300 行以内
- 型ガードは `utils/guards.ts` / `utils/is.ts` に集約する

```typescript
/**
 * 指定した sliceNum の数の配列に分割する
 * @example
 * splitMap([1,2,3,4,5], 2) // => [[1,2],[3,4],[5]]
 */
export const splitMap = (originArray: number[], sliceNum: number): number[][] => { ... };
```

### breaking change の判断基準

- **non-breaking**: optional 引数の追加、返り値の union を狭める、export の追加
- **breaking**: 引数の型変更・必須化、返り値の型変更・union 拡大、export の削除、throw ↔ undefined の切り替え
- breaking なら変更前に `rg -n "\b<関数名>\s*\(" src utils` で全呼び出し箇所を列挙し、影響範囲を把握する(複雑な場合は `.agents/skills/callgraph/SKILL.md` で caller chain を可視化)

## コンポーネント props の設計規律

- Props interface はコンポーネント定義の直上。`import type` を使う。React 19 なので `ref` は通常の props(`forwardRef` 不要)
- **composition > configuration**: `title=` `headerVariant=` `bodyPadding=` と設定値を増やすより、children 合成にする
- **boolean の増殖より variant**: `isPrimary` + `isSmall` + `isOutline` ではなく `variant: 'primary' | 'outline'` / `size: 'sm' | 'md'`。排他的な状態は discriminated union にする
- 必須 props は「無いと描画が成立しないもの」だけ。それ以外は optional + デフォルト値(実例: `src/features/Crypto/components/CryptoChart/index.tsx` の `isDark = false, height = 300`)
- `src/components/` の props に domain 型(feature の型)を混ぜない。混ぜたくなったらそれは feature 側のコンポーネント

## 外部境界(utils/api, utils/apis)

- 外部 API レスポンスは untrusted data。`api.get<T>` の型パラメータは cast でしかないため、**境界で valibot でパースしてから型付きで返す**(実例: `src/features/GeminiEmbedding/models/*/scheme.ts` の `v.object` スキーマ)
- パース失敗は expected failure として扱い、呼び出し元には `undefined` / `null` か明示的な結果型で返す
- branded types(`utils/branded` の `defineBrandedFactory`)は「同じプリミティブ型で混同事故が起きうる値」(ID・通貨量・割合等)が境界を越えるときに使う。内部だけで完結する値には不要
- 新しい外部 API を足すときは `utils/apis/config.ts` の `apiMap` にプロキシ設定を追加し、リクエスト関数は引数 interface + レスポンス interface を分離して定義する(実例: `utils/apis/crypto.ts` の `GetKLines` / `GetKLinesResponse`)

## Hard rules

- 公開済み utils API のシグネチャを、`rg` で全呼び出し箇所を確認せずに変えない
- `index.ts` から export していない内部実装を呼び出し側から直接 import させない
- expected failure を throw で表現しない(throw は契約違反のみ)
- 外部 API レスポンスを valibot 等で検証せずにロジック・描画へ流さない
- 1 つのモジュール内でエラー戦略を混在させない(throw / undefined / 結果型のどれかに統一)
- 公開 API の追加・変更にはテスト(`*.test.ts`、同ディレクトリ)を伴わせる → `.agents/skills/test-driven-development/SKILL.md`

## 完了チェックリスト

- [ ] 公開 API は `index.ts` 経由で export され、explicit return type と JSDoc `@example` がある
- [ ] expected failure は `undefined` / `null` で表現されている
- [ ] breaking change の場合、全呼び出し元を列挙し更新した
- [ ] props は variant ベースで、必須/任意の区別に根拠がある
- [ ] 外部 API レスポンスは境界で valibot パースされている
- [ ] `pnpm vitest run` / `pnpm run lint` / `pnpm run build` が通る
