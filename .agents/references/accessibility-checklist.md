# Accessibility Checklist(WCAG 2.1 AA)

このリポジトリ向けのアクセシビリティチェックリスト。`.agents/skills/frontend-ui-engineering/SKILL.md` から委譲される深掘り資料。

## 前提

- React 19 + typestyle(CSS-in-TS)。**Tailwind は不使用** — ユーティリティクラスではなく `style()` でスタイルを書く
- canvas / WebGL / オーディオビジュアライザ等、**非テキストコンテンツが主役の feature が多い**。「canvas しかない画面」はスクリーンリーダーには空白ページ。代替テキストと操作 UI のアクセシビリティが特に重要
- 確認は Chrome DevTools(Lighthouse / Accessibility tree)と VoiceOver(macOS: Cmd+F5)。Chrome DevTools MCP があればエージェントから直接検証できる(`.agents/skills/browser-testing-with-devtools/SKILL.md`)

## 1. キーボード操作

- [ ] すべてのインタラクティブ要素に Tab で到達できる(マウス前提の canvas 操作にもボタン等の代替経路がある)
- [ ] フォーカス順序が視覚的順序と一致している(`tabindex` は `0` か `-1` のみ。正の値は禁止)
- [ ] フォーカスが見える。`outline: 'none'` で消すだけのスタイルを書かない

```typescript
import { style } from 'typestyle';

const button = style({
  $nest: {
    '&:focus-visible': {
      outline: '2px solid #4d90fe',
      outlineOffset: '2px',
    },
  },
});
```

- [ ] カスタムウィジェットは Enter/Space で操作・Escape で閉じられる
- [ ] キーボードトラップがない(モーダルは例外: 開いている間はフォーカスを閉じ込め、閉じたら起動元に戻す)
- [ ] dat.gui 等のデバッグ UI ではなく、ユーザ向け操作には素の `<button>` / `<input>` を使う

```bash
# div/span への onClick(キーボード非対応の典型)を洗い出す
rg -n "<(div|span)[^>]*onClick" src
```

## 2. ラベル・スクリーンリーダー

- [ ] 画像・canvas に代替テキストがある。装飾なら `alt=""`、ビジュアライザ等は `role="img"` + `aria-label` で内容を説明する

```tsx
<canvas ref={canvasRef} role="img" aria-label="マイク入力の周波数スペクトラム" />
```

- [ ] すべての入力に対応するラベルがある(`<label htmlFor>` または `aria-label`)
- [ ] アイコンのみのボタンに `aria-label` がある(再生/停止・カメラ切替等)

```tsx
<button onClick={toggle} aria-label={isPlaying ? '停止' : '再生'}>
  {isPlaying ? <PauseIcon /> : <PlayIcon />}
</button>
```

- [ ] ボタン/リンクのテキストが内容を説明している(「こちら」「Click here」は不可)
- [ ] 見出しは `<h1>` 1 つ、レベルを飛ばさない
- [ ] `<html lang="ja">`(または実際の言語)が宣言され、各ページに固有の `<title>` がある(TanStack Router のルートごとに設定)
- [ ] アクション(`<button>`)とナビゲーション(TanStack Router の `<Link>`)を使い分けている。`div` に onClick は不可

## 3. コントラスト・視覚

- [ ] テキストのコントラスト比 ≥ 4.5:1(大きい文字 18px+ は ≥ 3:1)。typestyle の色定数を決める時点で確認する(DevTools の color picker がコントラスト比を表示する)
- [ ] UI 部品(ボタン枠・フォーカスリング)のコントラスト比 ≥ 3:1
- [ ] 色だけで情報を伝えない(チャートの系列・エラー状態にはアイコンやテキストを併用。CryptoCharts 系は特に)
- [ ] 200% ズームでレイアウトが破綻しない(固定 px の幅で文字が切れないか)
- [ ] 毎秒 3 回を超える点滅をさせない(シェーダ・ビジュアライザの演出で要注意)
- [ ] アニメーションは `prefers-reduced-motion` を尊重する(`utils/PreferColorScheme.ts` と同様に media query で分岐)

## 4. フォーカス管理

- [ ] モーダル・ダイアログ: 開いたら内部へフォーカス移動、閉じたら起動元へ戻す。`<dialog>` 要素を第一候補にする(フォーカストラップが組み込み)
- [ ] ルート遷移後にフォーカスが行方不明にならない(見出しか main へ移す)
- [ ] 動的に要素を消すとき、フォーカスがその要素上にあったら退避先を指定する
- [ ] 状態変化の通知に live region を使う

| 用途 | 書き方 |
|---|---|
| 保存完了・読み込み完了 | `<div role="status">読み込み完了</div>`(polite) |
| エラー | `<div role="alert">カメラを起動できませんでした</div>`(assertive) |

## 5. empty / loading / error state

非同期(モデルロード・API・デバイス権限)が多いこのリポジトリでは必須の観点。

- [ ] **loading**: スピナーだけでなくテキストを伴う(`<div role="status">モデルを読み込み中…</div>`)。`aria-busy="true"` を対象領域に付ける
- [ ] **empty**: 空白ではなく「データがない理由 + 次の行動」を示す
- [ ] **error**: `role="alert"` + 具体的なメッセージ + リトライ手段。色だけの赤文字にしない(アイコン/テキスト併用)
- [ ] カメラ・マイクの**権限拒否**は専用のエラー表示にする(無言で空 canvas を出さない)
- [ ] 3 状態の出し分けがテストされている(`*.test.ts`、テスト名日本語)

## 確認手順

```bash
pnpm run dev   # 起動して対象ルートを開く
```

1. **キーボードのみ**で対象 feature を一通り操作する(マウス禁止)
2. DevTools → Lighthouse → Accessibility を実行し、指摘を path 付きで記録
3. DevTools → Elements → Accessibility tree で、canvas 領域・アイコンボタンに名前が付いているか確認
4. VoiceOver(Cmd+F5)で読み上げ順・ラベルを確認
5. Rendering タブ → Emulate `prefers-reduced-motion` / コントラストエミュレーションで視覚条件を確認

## アンチパターン

| アンチパターン | 問題 | 修正 |
|---|---|---|
| `div` をボタンにする | フォーカス不可・キー操作不可 | `<button>` |
| `outline: 'none'` のみ | フォーカス位置が見えない | `:focus-visible` で代替スタイル |
| canvas のみの画面 | スクリーンリーダーに空白 | `role="img"` + `aria-label` + 操作 UI |
| 色だけのエラー表示 | 色覚特性で判別不能 | アイコン・テキスト併用 |
| スピナーのみの loading | 何が起きているか不明 | `role="status"` + テキスト |
| `tabindex="1"` 以上 | タブ順崩壊 | `0` / `-1` のみ |
| 自動再生オーディオ | 停止できない・読み上げと衝突 | ユーザ操作で開始、停止ボタン必須 |

## 関連

- UI 実装全般の進め方: `.agents/skills/frontend-ui-engineering/SKILL.md`
- 実ブラウザでの検証: `.agents/skills/browser-testing-with-devtools/SKILL.md`
