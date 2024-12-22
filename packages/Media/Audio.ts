import { Media } from "./Media";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const createAudioContext = (): AudioContext =>
  new AudioContext() ||
  new (window.AudioContext || window.webkitAudioContext)();
/**
 * 音声データの再生、停止、一時停止、再開を行うクラス
 * web audio api使用
 * https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API
 */
export class Audio extends Media {
  _context: AudioContext;
  _audioSource: AudioBufferSourceNode | null;
  _mediaSource: MediaStreamAudioSourceNode | null;
  isPlaying: boolean;

  constructor() {
    super();
    this._context = createAudioContext();
    this._audioSource = null;
    this._mediaSource = null;
    this.isPlaying = false;
  }

  get context(): AudioContext {
    return this._context;
  }

  get audioSource(): AudioBufferSourceNode | null {
    return this._audioSource;
  }

  get mediaSource(): MediaStreamAudioSourceNode | null {
    return this._mediaSource;
  }

  /**
   * 音声データの登録
   * @param arrayBuffer
   */
  async setAudio(arrayBuffer: ArrayBuffer) {
    this._context = createAudioContext();
    this._audioSource = this._context.createBufferSource();
    this._audioSource.buffer = await this._context.decodeAudioData(arrayBuffer);
  }

  /**
   * メディアデバイス（マイク等）の登録
   * @returns MediaStream
   */
  async getAudioStream(constraints: MediaStreamConstraints = { audio: true, video: false }): Promise<MediaStream> {
    const stream = await this.getUserMedia(constraints);
    this._context = createAudioContext();
    this._mediaSource = this._context.createMediaStreamSource(stream);
    return stream;
  }

  /**
   * 再生
   */
  play() {
    if (this._mediaSource) {
      return;
    }

    if (this._audioSource) {
      this._audioSource.disconnect();
    }

    this._audioSource?.connect(this._context.destination);
    this._audioSource?.start(0);
    this.isPlaying = true;
  }

  /**
   * 一時停止
   */
  pause() {
    if (this._context.state === 'running') {
      this._context.suspend();
      this.isPlaying = false;
    } else if (this._context.state === 'suspended') {
      this._context.resume();
      this.isPlaying = true;
    }
  }

  /**
   * 停止
   */
  stop() {
    if (!this._audioSource) {
      return;
    }

    // audioSourceの削除
    this._audioSource.stop(0);
    this._audioSource.disconnect();
    this._audioSource.buffer = null;
    // MediaSourceの削除
    this._mediaSource?.disconnect();
    this._mediaSource = null;
    this.isPlaying = false;

    this.deleteStream();
  }
}
