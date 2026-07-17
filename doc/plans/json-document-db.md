# JSON ドキュメント DB モジュール 実装計画

## 背景・目的

valibot スキーマで型安全に管理できるローカル JSON ドキュメント DB が欲しい。`defineDB({ dir })` で保存先を決め、`createTable({ key, schema })` でテーブル（`<key>.json`）を作り、全 CRUD 操作を valibot のスキーマ検証経由で行う。不正な値が書き込まれない・読み出し時もスキーマの型通りに取得できることを保証する。

ただし当リポジトリは **React 19 + Vite の純クライアント SPA**（Vercel static デプロイ）であり、`node:fs` によるディスク保存は **Node.js 実行コンテキストでしか動かない**。当初案の「`utils/db/json-db` に置く」「Hono サーバを立てる」は以下の理由で採用しない（事前協議で合意済み）。

- `utils/` は「ブラウザ安全な純粋ユーティリティ」を不変条件とする名前空間（現状 fs I/O ゼロ）。ここに `node:fs` 依存を入れると、`src/` から誤 import された瞬間に Vite ビルドが壊れる／fs ポリフィルが client バンドルに混入する。**スタイルの好みではなく正しさの境界**。
- Hono サーバは新デプロイ標的・CORS・2プロセス起動を生み、「dev 時にローカルフォルダへ保存する」という本質に対して過剰。

## 決定事項（協議済み）

| 項目         | 決定                                                                                         | 理由                                                                                             |
| :----------- | :------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| 配置         | `packages/json-db/`（Node 専用ワークスペースパッケージ）                                     | `pnpm-workspace.yaml` 既存。utils/ の純粋性を保ち、fs の client バンドル混入を構造的に防ぐ       |
| フロント連携 | Vite dev middleware（`configureServer`）                                                     | 依存追加ゼロ・`pnpm dev` 1プロセス。Hono 不要                                                    |
| 本番挙動     | dev-only ゲート（本番ビルドではエンドポイント不在 → fail-fast）                              | Vercel の FS は ephemeral。サイレント fallback は将来の事故源                                    |
| スキーマ     | ライブラリが `baseSchema`(id/createdAt/updatedAt) を所有、ユーザーは自分のフィールドのみ定義 | `insert` の入力型が id を受け付けず型が嘘をつかない。`createModelFactory` のハウススタイルに一致 |
| ファイル形式 | `<key>.json`（タイトル「JSON 形式」に従う。コメントの `.csv` は誤記と解釈）                  | ネスト値・型の表現に強く、スキーマと相性が良い                                                   |
| 日付         | ディスク・メモリ共に ISO 文字列で統一                                                        | Date オブジェクトを持たず valibot・JSON と整合                                                   |
| 整合性       | メモリキャッシュ（真実源）+ テーブル毎 async mutex（直列化）+ atomic write（tmp→rename）     | 単一プロセス内の read-modify-write 競合と partial write 破損を防ぐ最小構成                       |

## 目標 API（確定版）

```ts
import * as v from 'valibot';
import { defineDB } from '@repo/json-db';

const db = defineDB({ dir: './assets/json-db' });

// ユーザーは自分のフィールドだけ定義する（id/createdAt/updatedAt は書かない）
const User = v.object({
  name: v.string(),
  age: v.pipe(v.number(), v.minValue(0)),
});

const userTable = db.createTable({ key: 'user', schema: User });
// → assets/json-db/user.json が（無ければ）作られる

userTable.insert({ name: 'taro', age: 10 });
// → [{ id: 1, name: 'taro', age: 10, createdAt: '<ISO>', updatedAt: '<ISO>' }]
//   id は max+1 の自動採番、createdAt/updatedAt はライブラリが付与

userTable.gets(); // → Row[]（id/createdAt/updatedAt 含む）
userTable.gets({ name: 'taro' }); // → 部分一致フィルタ（プリミティブの構造比較）
userTable.update({ id: 1 }, { age: 11 }); // → 更新後 Row[]、updatedAt 更新、base フィールドは patch 不可
userTable.delete({ id: 1 }); // → 削除した Row[]
```

### 型レイヤの要点

```ts
const baseSchema = v.object({
  id: v.number(),
  createdAt: v.string(), // ISO 文字列
  updatedAt: v.string(),
});

// rowSchema = base + user（ライブラリ内部で合成）
type Row = v.InferOutput<typeof rowSchema>;
type InsertInput = v.InferInput<typeof userSchema>; // base フィールドを含まない
type Filter = Partial<Row>; // undefined キーは「制約なし」として除外
```

## マイルストーン（段階的実装）

### フェーズ 1: ワークスペース・パッケージのセットアップ

1. `packages/json-db/` を作成し `package.json`（name: `@repo/json-db`, type: module, valibot を peer/dep）を置く。
2. `tsconfig.json`（`module: ESNext`, `moduleResolution: bundler`, `types: ["node"]`）。
3. vitest は当該パッケージのテストを `environment: 'node'` で実行できるようにする（ルート vite.config か個別設定）。
4. `pnpm-workspace.yaml` に `packages/*` を含める。

- **完了条件**: `pnpm -F @repo/json-db exec tsc --noEmit` がエラーなしで通る（空実装でも可）。

### フェーズ 2: 型レイヤ（schema.ts / type.ts）

1. `baseSchema` を定義。
2. ユーザースキーマと base を合成して `rowSchema` を作る関数。
3. `InsertInput` / `Row` / `Filter` 型を導出。

- **完了条件**: `insert` 入力型が id/createdAt/updatedAt を受け付けない（型テストで確認）。

### フェーズ 3: 永続化レイヤ（storage.ts）

1. ロード: ファイル無し → `[]`、parse 失敗 → 明示的に throw（サイレントリセットしない）。
2. atomic write: `writeFile(tmp)` → `rename(tmp, real)`。
3. テーブル毎の async mutex で全 mutation を直列化。mutation 毎に flush。

- **完了条件**: 並行 `insert` を多数同時実行しても全件が失われず連番 id が一意（テストで確認）。

### フェーズ 4: コア（defineDB / createTable / CRUD）

1. `defineDB({ dir })` → `{ createTable }`。
2. `createTable({ key, schema })` → メモリキャッシュをロードし `{ insert, gets, update, delete }` を返す。
3. 全操作で valibot `parse(rowSchema, ...)` を通す（不正値は例外）。
4. `gets(filter)`: filter の undefined キーを除外し、プリミティブの構造比較で部分一致。ネスト/dot-path は対象外と明記。

- **完了条件**: 目標 API の全シグネチャが型通りに動く。

### フェーズ 5: テスト（vitest, TDD）

- insert（id 採番・timestamps 付与）、gets（全件・filter）、update（updatedAt 更新・base 不可）、delete。
- スキーマ拒否（不正値で throw）。
- atomic write（書き込み中断を模した破損耐性 / 連番一意）。
- ロード時 parse 失敗で throw。
- **完了条件**: `pnpm -F @repo/json-db exec vitest run` が green。

### フェーズ 6: Vite dev middleware + ブラウザクライアント

1. `packages/json-db/vite-plugin.ts`: `configureServer` で `/api/__json-db/:table` を `server.middlewares.use` でマウント（純 node:http、Hono 不使用）。
2. `vite.config.ts` に dev のみ条件付きで組み込み。本番ビルドではマウントしない。
3. ブラウザ側 `defineDB` client: 同一 API を fetch で叩く薄いラッパー。本番でエンドポイント不在なら fail-fast。

- **完了条件**: `pnpm dev` 中にフロントから CRUD でき、`pnpm build` が壊れない。

## スコープ外 / 将来課題

- ネストフィールド・dot-path クエリ、範囲検索、ソート、ページング。
- スキーマ進化（既存行が新必須フィールドで parse 失敗）→ 当面 strict reject。将来 `migrate()` を別途。
- 規模・並行性が本物になったら JSON をやめ SQLite（`better-sqlite3`）へ。同じファクトリ API・別ドライバ。
- 文字列 id / uuid 等の base 上書き（`baseFields` オプション）は要望が出たら。

## 検証（完了の証拠）

- [ ] `pnpm -F @repo/json-db exec vitest run` が green
- [ ] `pnpm run lint` が green
- [ ] `pnpm run build`（ルート SPA）が壊れない
- [ ] `src/` から `@repo/json-db` を import すると lint/build で弾かれる（境界が機能している）
