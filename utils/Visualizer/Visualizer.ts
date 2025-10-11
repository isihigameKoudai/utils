import { Audio } from '../Media';
import type { RenderCallBack, RenderOptions } from './type';

// requestAnimationFrame の定義を修正
export const requestAnimationFrame = () =>
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

// cancelAnimationFrame の定義を修正
export const cancelAnimationFrame = () =>
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  window.oCancelAnimationFrame;

/**
 * 取り込んだ音声を任意のビジュアルに変換・描画の機能を司る
 */
export class Visualizer extends Audio {
  analyzer: AnalyserNode | null;
  timeDomainArray: Uint8Array;
  spectrumArray: Uint8Array;
  timeDomainRawArray: Float32Array;
  spectrumRawArray: Float32Array;
  $canvas: HTMLCanvasElement | null;
  requestAnimationFrameId: number;

  constructor() {
    super();
    this.analyzer = null;
    this.timeDomainArray = new Uint8Array();
    this.spectrumArray = new Uint8Array();
    this.timeDomainRawArray = new Float32Array();
    this.spectrumRawArray = new Float32Array();
    this.$canvas = null;
    this.requestAnimationFrameId = 0;
    window.requestAnimationFrame = requestAnimationFrame();
    window.cancelAnimationFrame = cancelAnimationFrame();
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
    }: RenderOptions,
  ) {
    // 音声の再生
    super.play();
    // ビジュアライザーの初期化
    this.analyzer = this.context.createAnalyser(); // AnalyserNodeを作成
    this.analyzer.smoothingTimeConstant = smoothingTimeConstant;
    this.analyzer.fftSize = fftSize;
    this.timeDomainArray = new Uint8Array(this.analyzer.frequencyBinCount); // 時間領域の波形データを格納する配列を生成
    this.spectrumArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.timeDomainRawArray = new Float32Array(this.analyzer.fftSize); // 波形表示用データ
    this.spectrumRawArray = new Float32Array(this.analyzer.frequencyBinCount); // スペクトル波形用データ

    if (this._audioSource) {
      this._audioSource.connect(this.analyzer);
    }

    if (this._mediaSource) {
      this._mediaSource.connect(this.analyzer);
    }

    // ビジュアライザーをcanvasに反映
    if ($canvas) {
      $canvas.width = canvasWidth;
      $canvas.height = canvasHeight;
      this.$canvas = $canvas;
    }

    this.render(renderCallBack);
  }

  /**
   * CallBackを受け取って再起的に描画処理を実行する。
   * @param {Function} renderCallBack webglに描画する内容。 シェーダーなど任意の描画内容を記述する。
   */
  render(renderCallBack: RenderCallBack) {
    if (!this.analyzer) {
      throw new Error('analyzer is null');
    }

    // その時点での波形データを元にした配列を取得
    this.analyzer.getByteTimeDomainData(this.timeDomainArray);
    this.analyzer.getByteFrequencyData(this.spectrumArray);
    this.analyzer.getFloatTimeDomainData(this.timeDomainRawArray);
    this.analyzer.getFloatFrequencyData(this.spectrumRawArray);

    renderCallBack({
      $canvas: this.$canvas!,
      frequencyBinCount: this.analyzer.frequencyBinCount,
      timeDomainArray: this.timeDomainArray,
      spectrumArray: this.spectrumArray,
      timeDomainRawArray: this.timeDomainRawArray,
      spectrumRawArray: this.spectrumRawArray,
    });

    this.requestAnimationFrameId = window.requestAnimationFrame(
      this.render.bind(this, renderCallBack),
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
