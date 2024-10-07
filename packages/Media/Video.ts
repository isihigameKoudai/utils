import { Media } from "./Media";

export class Video extends Media {
  _$video: HTMLVideoElement | null;

  _magnification: { x: number; y: number };

  constructor() {
    super();
    this._magnification = { x: 1, y: 1 };
    this._$video = null;
  }

  get magnification() {
    return this._magnification;
  }

  get $video() {
    return this._$video;
  }

  async getVideoStream() {
    const videoStream = await this.getUserMedia({ video: true });
    return videoStream;
  }

  setMagnification(x: number, y: number) {
    this._magnification = { x, y };
  }

  setVideo($video: HTMLVideoElement) {
    if (!this.stream) {
      console.error('stream is not loaded');
      return;
    }
    $video.srcObject = this.stream;
    this._$video = $video;
  }
}
