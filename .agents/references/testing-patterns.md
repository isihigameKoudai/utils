# Testing Patterns(Vitest)

このリポジトリのテストパターン集。`.agents/skills/test-driven-development/SKILL.md`(手順)から委譲される深掘り資料。

## このリポジトリの前提

- テストランナーは **Vitest** のみ(`pnpm vitest run`)。Jest / Playwright / supertest は存在しない
- テストはソースと同階層に `*.test.ts`(`array.ts` → `array.test.ts`)
- テスト名(`it`)は **日本語** で挙動を記述する
- ブラウザ API(AudioContext, MediaStream 等)のモックは `utils/__test__/mocks/` に共有実装がある。新規に手書きする前にここを確認する

```bash
pnpm vitest run                              # 全テスト 1 回実行
pnpm vitest run utils/array/array.test.ts    # 単一ファイル
pnpm vitest run -t "配列を指定した数で分割する"   # テスト名パターン
pnpm run test                                # watch(開発中のみ)
```

## 基本構造(Arrange-Act-Assert)

```typescript
import { describe, it, expect } from 'vitest';

import { splitMap } from './array';

describe('splitMap', () => {
  it('配列を指定した数で分割する', () => {
    // Arrange
    const input = [1, 2, 3, 4, 5];
    // Act
    const result = splitMap(input, 2);
    // Assert
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('空配列を渡すと空配列を返す', () => {
    expect(splitMap([], 2)).toEqual([]);
  });
});
```

- 1 つの `it` に 1 つの概念。複数挙動を詰めない
- 空配列・`undefined`・境界値(0, 負数, 上限)を必ずカバーする(AGENTS.md の方針)

## テストダブルの優先順位

**real > fake > stub > mock** の順で選ぶ。下に行くほど「実装の詳細」に結合し、リファクタで壊れやすくなる。

| 手段 | 使いどころ |
|---|---|
| real(実物) | 純粋関数・データ変換。`utils/` の大半はこれで足りる |
| fake(簡易実装) | in-memory の Map で storage を代替する等 |
| stub(固定値返却) | `vi.spyOn(...).mockResolvedValue(...)` で外部応答を固定 |
| mock(呼び出し検証) | 最終手段。外部 API・非決定処理(時刻・乱数)・ブラウザ API に限る |

**状態検証 > 相互作用検証**: 操作の結果(返り値・プロパティ)を assert する。`toHaveBeenCalledTimes` のような呼び出し回数・順序の assert は、それ自体が仕様である場合(例: API を 1 回しか叩かない保証)に限る。

## vi.spyOn — 既存オブジェクトの一部を差し替える

```typescript
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Audio', () => {
  beforeEach(() => {
    vi.spyOn(audio.context, 'decodeAudioData').mockResolvedValue(mockAudioBuffer);
  });

  afterEach(() => {
    vi.restoreAllMocks(); // 必須。テスト間のモック漏れを防ぐ
  });
});
```

実例: `utils/Media/Audio.test.ts`(AudioContext のモック)、`utils/tensorflow/*/**.test.ts`(ML モデルのモック)。

## vi.mock — モジュール全体を差し替える

```typescript
import { vi } from 'vitest';

// hoist されるためファイル先頭で宣言する
vi.mock('@mediapipe/tasks-vision', () => ({
  FilesetResolver: { forVisionTasks: vi.fn().mockResolvedValue({}) },
}));

// 一部だけ差し替え、残りは実物を使う
vi.mock('./module', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./module')>()),
  generateId: vi.fn().mockReturnValue('test-id'),
}));
```

注意: `vi.mock` のファクトリ内では外側の変数を参照できない(hoisting)。必要なら `vi.hoisted` を使う。

## Fake Timers — 時間依存のテスト

`setTimeout` / `setInterval` / `Date` を実時間で待たない。

```typescript
import { vi, it, expect, beforeEach, afterEach } from 'vitest';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it('指定時間後にコールバックを実行する', () => {
  const fn = vi.fn();
  debounce(fn, 1000)();
  expect(fn).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1000);
  expect(fn).toHaveBeenCalledOnce();
});

it('現在日時に依存する処理を固定日時でテストする', () => {
  vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  // dayjs() 等が固定される
});
```

Promise を挟む timer は `await vi.advanceTimersByTimeAsync(1000)` / `await vi.runAllTimersAsync()` を使う。

## テーブルテスト(it.each)

同じロジックに対する入力バリエーションは `it.each` でまとめる。境界値の網羅に有効。

```typescript
it.each([
  { input: [1, 2, 3], size: 2, expected: [[1, 2], [3]] },
  { input: [],        size: 2, expected: [] },
  { input: [1],       size: 5, expected: [[1]] },
])('size=$size で $input を分割すると $expected になる', ({ input, size, expected }) => {
  expect(splitMap(input, size)).toEqual(expected);
});
```

ただし分岐ごとに前提や検証内容が変わる場合は個別の `it` に分ける(DAMP > DRY)。

## 非同期テスト

```typescript
// resolve / reject の検証
await expect(fetchTicker('BTC')).resolves.toMatchObject({ symbol: 'BTC' });
await expect(fetchTicker('')).rejects.toThrow('symbol is required');

// 期待失敗(undefined/null 返却方針)の検証
// このリポジトリは想定内の失敗で throw せず undefined/null を返す方針(AGENTS.md)
expect(await safeParse(invalidInput)).toBeUndefined();
```

- 非同期テストは必ず `await` する。await 忘れは「常に pass する偽テスト」になる
- fetch のモックは `vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(data)))`

## ブラウザ API のモック

`utils/Media/`, `utils/Visualizer/`, `utils/tensorflow/` のように DOM・メディア・ML に依存するクラスは、コンストラクタで `navigator` / `window` を注入できる設計になっている。テストでは `utils/__test__/mocks/` のモックを注入する。

```typescript
import { navigatorMock, windowMock } from '../__test__/mocks/global';

const audio = new Audio({ navigator: navigatorMock, window: windowMock });
```

新しいブラウザ依存クラスを書くときも同じ注入パターンに従うと、モックが再利用できる。

## アンチパターン

| アンチパターン | 問題 | 代替 |
|---|---|---|
| 内部実装の検証(private 呼び出し順等) | リファクタで壊れる | 入出力・状態を検証 |
| 内部関数同士を mock で切り離す | 何も検証していない | 境界(fetch・ブラウザ API)だけ mock |
| `vi.restoreAllMocks()` 忘れ | テスト間汚染、順序依存の flaky | `afterEach` で必ず復元 |
| 実時間 `setTimeout` 待ち | 遅い・flaky | fake timers |
| `it.skip` の放置 | 死んだ仕様 | 直すか消す |
| 通すための既存テスト改変 | バグ隠蔽 | 仕様変更なら理由をコミットに残す |
| snapshot の乱用 | 差分を誰もレビューしない | 具体的な値を assert |
| 最初から pass するテスト | 何も証明しない | RED を確認してから実装(TDD スキル参照) |

## 関連

- 手順(RED → GREEN → REFACTOR、Prove-It): `.agents/skills/test-driven-development/SKILL.md`
- 単体テストで代替できないブラウザ挙動の検証: `.agents/skills/browser-testing-with-devtools/SKILL.md`
