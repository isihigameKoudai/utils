export class Media {

  private _stream: MediaStream | null;

  constructor() {
    this._stream = null;
  }

  get stream() {
    return this._stream;
  }

  /**
   * ユーザメディアを取得する
   * @param constraints 
   * @returns 
   */
  async getUserMedia(constraints: MediaStreamConstraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this._stream = stream;
      return stream;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  deleteStream() {
    this.stream?.getVideoTracks().forEach(videoStream => {
      videoStream.enabled = false;
      videoStream.stop();
    });
    this.stream?.getAudioTracks().forEach(audioStream => {
      audioStream.enabled = false;
      audioStream.stop();
    });
    this._stream = null;
  }
};
