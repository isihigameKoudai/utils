import Audio from "./Audio";

declare global {
  interface Window {
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
  }
}
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

export const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  window.oCancelAnimationFrame;

export type RenderCallBack = (props: {
  $canvas: HTMLCanvasElement;
  frequencyBinCount: number;
  times: Uint8Array;
  analyzer: AnalyserNode;
}) => void;

type RenderOptions = {
  $canvas: HTMLCanvasElement;
  canvasWidth?: number;
  canvasHeight?: number;
  smoothingTimeConstant?: number;
  fftSize?: number;
};

/**
 * 取り込んだ音声を任意のビジュアルに変換・描画の機能を司る
 */
export default class Visualizer extends Audio {
  analyzer: AnalyserNode | null;
  times: Uint8Array;
  $canvas: HTMLCanvasElement | null;
  requestAnimationFrameId: number;

  constructor() {
    super();
    this.analyzer = null;
    this.times = new Uint8Array();
    this.$canvas = null;
    this.requestAnimationFrameId = 0;
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
  }

  /**
   * 音声再生と描画の開始
   * @param {Function} renderCallBack webglに描画する内容。 シェーダーなど任意の描画内容を記述する。
   * @param {Object} renderOptions 描画に関する設定
   * @param {Object} renderOptions.$canvas webglの描画先
   * @param {number} renderOptions.canvasWidth 描画先canvasのwidth
   * @param {number} renderOptions.canvasHeight 描画先canvasのheight
   * @param {number} renderOptions.smoothingTimeConstant 0~1まで設定でき、0に近いほど描画の更新がスムーズになり, 1に近いほど描画の更新が鈍くなる。
   * @param {number}  option.fftSize FFTサイズを指定する。デフォルトは2048。
   */
  start(
    renderCallBack: RenderCallBack,
    {
      $canvas,
      canvasWidth = window.innerWidth,
      canvasHeight = window.innerHeight,
      smoothingTimeConstant = 0.5,
      fftSize = 2048,
    }: RenderOptions
  ) {
    // 音声の再生
    super.play();
    // ビジュアライザーの初期化
    this.analyzer = this.context.createAnalyser(); // AnalyserNodeを作成
    this.times = new Uint8Array(this.analyzer.frequencyBinCount); // 時間領域の波形データを格納する配列を生成

    if (this._audioSource) {
      this._audioSource.connect(this.analyzer);
    }

    if (this._mediaSource) {
      this._mediaSource.connect(this.analyzer);
    }

    // ビジュアライザーをcanvasに反映
    $canvas.width = canvasWidth;
    $canvas.height = canvasHeight;
    this.$canvas = $canvas;
    this.analyzer.smoothingTimeConstant = smoothingTimeConstant;
    this.analyzer.fftSize = fftSize;

    this.render(renderCallBack);
  }

  /**
   * CallBackを受け取って再起的に描画処理を実行する。
   * @param {Function} renderCallBack webglに描画する内容。 シェーダーなど任意の描画内容を記述する。
   */
  render(renderCallBack: RenderCallBack) {
    if (!this.analyzer) {
      throw new Error("analyzer is null");
    }

    this.analyzer.getByteTimeDomainData(this.times);

    renderCallBack({
      $canvas: this.$canvas!,
      frequencyBinCount: this.analyzer.frequencyBinCount,
      times: this.times,
      analyzer: this.analyzer,
    });

    this.requestAnimationFrameId = window.requestAnimationFrame(
      this.render.bind(this, renderCallBack)
    );
  }

  /**
   * 音声とビジュアライザーを停止させる
   */
  stop() {
    super.stop();
    this.analyzer?.disconnect();
    window.cancelAnimationFrame(this.requestAnimationFrameId);
  }
}
