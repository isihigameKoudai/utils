declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

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
  _audioSource: AudioBufferSourceNode | null;
  _mediaSource: MediaStreamAudioSourceNode | null;
  isPlaying: boolean;

  constructor() {
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
   * @param stream デバイス情報
   */
  async setDeviceAudio(constraints = { audio: true }) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this._context = createAudioContext();
      this._mediaSource = this._context.createMediaStreamSource(stream);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 再生（登録されている音声を再生）
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
    if (this._audioSource) {
      this.stopAudio();
    } else {
      this.stopDeviceAudio();
    }
  }

  /**
   * 音声データの停止
   */
  stopAudio() {
    if (!this._audioSource) {
      return;
    }

    this._audioSource.stop();
    this._audioSource.disconnect();
    this._audioSource.buffer = null;
    this.isPlaying = false;
  }

  /**
   * デバイスメディアデータの停止
   */
  stopDeviceAudio() {
    if (!this._mediaSource) {
      return;
    }
    this._mediaSource = null;
    this.isPlaying = false;
  }
}
