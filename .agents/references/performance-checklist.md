# Performance Checklist(描画・計算が重い SPA 向け)

このリポジトリ向けのパフォーマンスチェックリスト。`.agents/skills/performance-optimization/SKILL.md` から委譲される深掘り資料。

## 前提:このアプリの性能特性

- クライアントサイドのみの SPA。サーバ・DB・TTFB 最適化は対象外
- 主役は **three.js / GLSL シェーダ / canvas / MediaPipe・TensorFlow.js 推論 / オーディオ処理** — つまり「初回ロード」より **フレーム予算(60fps = 16.7ms/frame)** と **メモリリーク** が問題になりやすい
- React 19、**React Compiler 未導入**。`useMemo` / `useCallback` は計測根拠がある時のみ(AGENTS.md 同様の方針)

## 0. 計測が先、最適化は後

推測で最適化しない。順序は固定: **計測 → ボトルネック特定 → 修正 → 再計測**。

### Chrome DevTools(Chrome DevTools MCP が利用可能)

1. `pnpm run dev` で起動し、対象 feature のルートを開く
2. **Performance パネルで録画**しながら操作する。見るもの:
   - Long task(> 50ms)の発生源(自前コードか、推論か、GC か)
   - フレームレートの落ち込みと、その瞬間の call tree
   - **Memory タブ / Performance の JS Heap**: 鋸歯状の急峻な山 = フレーム毎アロケーション、右肩上がり = リーク
3. CPU throttling(4x〜6x)で再現性を上げる。手元の Mac で滑らかでも throttle で破綻する rAF ループは多い
4. Chrome DevTools MCP が設定されていれば、trace の取得・分析をエージェントから直接実行できる(`.agents/skills/browser-testing-with-devtools/SKILL.md`)

### React Profiler

1. React DevTools → Profiler → 録画 → 操作 → 停止
2. 「なぜ再レンダリングされたか(props / state / 親)」をコミット単位で確認
3. 修正前後で同じ操作を録画し、コミット回数・所要時間を比較して報告する

## 1. レンダリング(再レンダリングの起因特定)

- [ ] 再レンダリングの**起因**を特定したか(Profiler で確認してから直す。memo を「とりあえず」貼らない)
- [ ] zustand(`utils/i-state`)の購読が **selector で絞られている**か。store 全体を取ると無関係な更新で全購読者が再レンダリングする

```typescript
// NG: store 全体を購読
const state = useStore();
// OK: 必要なスライスだけ購読
const count = useStore((s) => s.count);
```

- [ ] 高頻度更新(マウス座標・オーディオレベル・推論結果)を React state に流していないか。フレーム毎に変わる値は `useRef` + 直接描画(canvas / three.js)に逃がし、React のレンダリングサイクルから外す
- [ ] render 中に毎回新しいオブジェクト・配列を作って子に渡していないか(memo を無効化する)
- [ ] typestyle の `style()` 呼び出しが render 内にないか。クラス生成は**モジュールトップレベル**で 1 回。動的な値は CSS variables か `style` 属性で渡す

```typescript
// NG: render 毎にクラス生成
const Component = () => <div className={style({ color: 'red' })} />;
// OK: モジュールトップレベルで 1 回
const box = style({ color: 'red' });
const Component = () => <div className={box} />;
```

- [ ] `useMemo` / `useCallback` の追加には Profiler の計測根拠があるか(React Compiler 未導入だが、根拠なき memo 化はノイズ)

## 2. rAF ループ・three.js・推論

### rAF ループ内アロケーション

`requestAnimationFrame` / `useFrame`(@react-three/fiber)の中は毎秒 60 回走る。ここでのアロケーションは GC スパイク = カクつきに直結する。

- [ ] ループ内で `new Vector3()` / `new Float32Array()` / オブジェクトリテラル生成をしていないか → ループ外で確保して再利用(オブジェクトプール)

```typescript
// NG: 毎フレーム生成
useFrame(() => { mesh.position.copy(new THREE.Vector3(x, y, z)); });
// OK: 再利用
const tmp = new THREE.Vector3();
useFrame(() => { mesh.position.copy(tmp.set(x, y, z)); });
```

- [ ] ループ内で `console.log` / 配列 `map`・spread をしていないか
- [ ] 非表示時にループを止めているか(ルート遷移後も rAF が回り続けるのが典型リーク)。cleanup で `cancelAnimationFrame`

### three.js の dispose 漏れ

three.js のリソースは GC されない。**作ったら dispose** が原則。

- [ ] `geometry.dispose()` / `material.dispose()` / `texture.dispose()` / `renderer.dispose()` がアンマウント時(`useEffect` の cleanup)に呼ばれているか
- [ ] `WebGLRenderTarget` / `ShaderMaterial`(Noise, StableFluids, MeltTheBorder 等)を作り直すパスで旧リソースを破棄しているか
- [ ] 確認方法: ルートを行き来して DevTools Memory でヒープスナップショット比較。`renderer.info.memory`(geometries / textures)が単調増加していないか

### ML 推論(MediaPipe / TensorFlow.js)

- [ ] モデルのロードは 1 回か(再レンダリングで `createDetector` が再実行されていないか)
- [ ] 推論を毎フレーム回す必要があるか(検出系は 15〜30fps への間引きで十分なことが多い)
- [ ] tfjs の Tensor を `dispose()` / `tf.tidy()` で解放しているか(`tf.memory().numTensors` が増え続けたらリーク)
- [ ] アンマウント時に detector / stream(`MediaStreamTrack.stop()`)を解放しているか

## 3. バンドル(初回ロード)

```bash
pnpm run build
# 出力のチャンクサイズ一覧を確認する(vite が dist/ の各チャンクと gzip サイズを表示する)
```

- [ ] three.js / @mediapipe/tasks-vision / chromadb / @google/genai のような重依存が**初回チャンク**に入っていないか。feature 単位の `import()`(dynamic import)で分割し、その feature のルートを開くまでロードしない
- [ ] TanStack Router のルートが lazy になっているか(file-based routing でも heavy feature は遅延させる)
- [ ] `import { x } from 'lodash-es'` の名前付き import になっているか(default import は tree-shaking を妨げる)
- [ ] 未使用 export を `pnpm run tsr` で検出・削除したか(デッドコードはバンドルに残る)
- [ ] モデルファイル・テクスチャ等の大きい静的アセットは初回表示をブロックしない位置でロードしているか

## アンチパターン早見表

| アンチパターン | 症状 | 修正 |
|---|---|---|
| rAF ループ内アロケーション | 周期的な GC スパイク・カクつき | ループ外で確保・再利用 |
| dispose 漏れ | ルート行き来でメモリ単調増加 | cleanup で dispose / stop |
| store 全体購読 | 無関係な操作で全体再レンダリング | zustand selector |
| 高頻度値を state 化 | 毎フレーム React 再レンダリング | ref + 直接描画 |
| render 内 `style()` | スタイル生成コスト + クラス増殖 | トップレベルで 1 回 |
| 重依存が初回チャンク | 初回ロードが数 MB | feature 単位 dynamic import |
| 根拠なき memo 化 | 可読性低下・効果なし | Profiler で計測してから |

## 関連

- 計測 → 修正の進め方全体: `.agents/skills/performance-optimization/SKILL.md`
- ブラウザでの計測実務(DevTools / MCP): `.agents/skills/browser-testing-with-devtools/SKILL.md`
