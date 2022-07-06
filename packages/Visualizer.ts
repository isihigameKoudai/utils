/**
 * stream
 * const stream = await navigator.mediaDevices.getUserMedia({audio: true});
 *
 * // AnalyserNode（音声の時間と周波数を解析、音声の可視化に使用）の生成
 * const audioCtx = new AudioContext();
 * const analyzer = audioCtx.createAnalyser();
 *
 * // 表示用canvasの設定
 * const canvas = document.querySelector(target);
 *
 * render()
 * 
 * setVisualizer(audioBuffer) {
    // Visualizerの設定
    this.sourceNode = this.ctx.createBufferSource(); // AudioBufferSourceNodeを作成
    this.sourceNode.buffer = audioBuffer; // 取得した音声データ(バッファ)を音源に設定
    this.analyserNode = this.ctx.createAnalyser(); // AnalyserNodeを作成
    this.times = new Uint8Array(this.analyserNode.frequencyBinCount); // 時間領域の波形データを格納する配列を生成
    this.sourceNode.connect(this.analyserNode); // AudioBufferSourceNodeをAnalyserNodeに接続
    this.analyserNode.connect(this.ctx.destination); // AnalyserNodeをAudioDestinationNodeに接続
    this.sourceNode.start(0); // 再生開始

    // requestAnimationFrameの各ブラウザ対応
    const requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    this.draw({ target: "#canvas", smoothingTimeConstant: 0.5, fftSize: 2048 });
  }
 */
declare global {
  interface Window {
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }
}
export const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

type RenderCallBackProps = {};
type RenderCallBack = (props: RenderCallBackProps) => void;

export default class Visualizer {
  // stream
  // analyzer audioCtx.createAnalyser();
  // times new Uint8Array(this.analyserNode.frequencyBinCount); // 時間領域の波形データを格納する配列を生成
  // $gl
  // $canvas
  constructor() {
    window.requestAnimationFrame = requestAnimationFrame;
  }

  render() {
    window.requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    window.requestAnimationFrame(this.render.bind(this));
  }
}
