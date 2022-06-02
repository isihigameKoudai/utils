/**
 * 音声データの再生、停止、一時停止、再開を行うクラス
 */
export default class Audio {
  context: AudioContext;
  audioSource: AudioBufferSourceNode;
  isPlaying: boolean;

  constructor() {
    this.context =
      new AudioContext() ||
      new (window.AudioContext || window.webkitAudioContext)();
    this.audioSource = this.context.createBufferSource();
    this.isPlaying = false;
  }

  /**
   * 音声データの登録
   * @param arrayBuffer
   */
  async setAudio(arrayBuffer: ArrayBuffer) {
    this.audioSource = this.context.createBufferSource();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    this.audioSource.buffer = audioBuffer;
  }

  /**
   * 再生（登録されている音声を再生）
   */
  play() {
    if (this.audioSource) {
      this.audioSource.disconnect();
    }

    this.audioSource.connect(this.context.destination);
    this.audioSource.start(0);
    this.isPlaying = true;
  }

  /**
   * 一時停止/再生
   */
  pause() {
    if (this.isPlaying) {
      this.context.suspend();
      this.isPlaying = false;
    } else {
      this.context.resume();
      this.isPlaying = true;
    }
  }

  /**
   * 停止
   */
  stop() {
    this.audioSource.stop();
    this.audioSource.disconnect();
    this.audioSource.buffer = null;
    this.isPlaying = false;
  }
}
