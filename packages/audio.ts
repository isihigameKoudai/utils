export const createAudioContext = (): AudioContext =>
  new AudioContext() ||
  new (window.AudioContext || window.webkitAudioContext)();
/**
 * 音声データの再生、停止、一時停止、再開を行うクラス
 * web audio api使用
 * https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API
 */
export default class Audio {
  _context: AudioContext;
  _audioSource: AudioBufferSourceNode;
  isPlaying: boolean;

  constructor() {
    this._context = createAudioContext();
    this._audioSource = this._context.createBufferSource();
    this.isPlaying = false;
  }

  get context(): AudioContext {
    return this._context;
  }

  get audioSource(): AudioBufferSourceNode {
    return this._audioSource;
  }

  /**
   * 音声データの登録
   * @param arrayBuffer
   */
  async setAudio(arrayBuffer: ArrayBuffer) {
    this._context = createAudioContext();
    this._audioSource = this._context.createBufferSource();
    const audioBuffer = await this._context.decodeAudioData(arrayBuffer);
    this._audioSource.buffer = audioBuffer;
  }

  /**
   * 再生（登録されている音声を再生）
   */
  play() {
    if (this._audioSource) {
      this._audioSource.disconnect();
    }

    this._audioSource.connect(this._context.destination);
    this._audioSource.start(0);
    this.isPlaying = true;
  }

  /**
   * 一時停止/再生
   */
  pause() {
    if (this.isPlaying) {
      this._context.suspend();
      this.isPlaying = false;
    } else {
      this._context.resume();
      this.isPlaying = true;
    }
  }

  /**
   * 停止
   */
  stop() {
    this._audioSource.stop();
    this._audioSource.disconnect();
    this._audioSource.buffer = null;
    this.isPlaying = false;
  }
}
