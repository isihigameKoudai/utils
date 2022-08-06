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

type RenderCallBack = (props: {
  $gl: WebGL2RenderingContext;
  frequencyBinCount: number;
  times: Uint8Array;
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
  analyserNode: AnalyserNode;
  times: Uint8Array;
  $canvas: HTMLCanvasElement | null;
  $gl: WebGL2RenderingContext | null;
  requestAnimationFrameId: number;

  constructor() {
    super();
    this.analyserNode = this._context.createAnalyser();
    this.times = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.$canvas = null;
    this.$gl = null;
    this.requestAnimationFrameId = 0;
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
  }

  /**
   * マイクや音声ファイルのArrayBufferをセットする。
   * @param arrayBuffer 汎用的な音声のバイト配列。
   */
  async setAudio(arrayBuffer: ArrayBuffer) {
    await super.setAudio(arrayBuffer);
    this.analyserNode = this.context.createAnalyser();
    this.audioSource.connect(this.analyserNode);
    this.analyserNode.connect(this.context.destination);
  }

  /**
   * 描画の開始
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

    // ビジュアライザーをcanvasに反映
    $canvas.width = canvasWidth;
    $canvas.height = canvasHeight;
    this.$gl = $canvas.getContext("webgl2");
    this.$canvas = $canvas;
    this.analyserNode.smoothingTimeConstant = smoothingTimeConstant;
    this.analyserNode.fftSize = fftSize;
    this.analyserNode.getByteTimeDomainData(this.times);
    // 再起レンダー処理
    this.render(renderCallBack);
  }

  /**
   * 音声とビジュアライザーを停止させる
   */
  stop() {
    super.stop();
    window.cancelAnimationFrame(this.requestAnimationFrameId);
  }

  /**
   * CallBackを受け取って再起的に描画処理を実行する。
   * @param {Function} renderCallBack webglに描画する内容。 シェーダーなど任意の描画内容を記述する。
   */
  render(renderCallBack: RenderCallBack) {
    renderCallBack({
      $gl: this.$gl!,
      frequencyBinCount: this.analyserNode.frequencyBinCount,
      times: this.times,
    });
    this.requestAnimationFrameId = window.requestAnimationFrame(
      this.render.bind(this, renderCallBack)
    );
  }
}
