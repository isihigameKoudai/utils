import { Media } from './Media';

const INITIAL_MAGNIFICATION = { x: 1, y: 1 };

interface Params {
  navigator: Navigator;
}

export class Video extends Media {
  _$video: HTMLVideoElement | null;

  _magnification: { x: number; y: number };

  constructor(params: Params) {
    super(params);
    this._magnification = INITIAL_MAGNIFICATION;
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

  setMagnification({ x, y }: { x: number; y: number }) {
    this._magnification = { x, y };
  }

  resetMagnification() {
    this._magnification = INITIAL_MAGNIFICATION;
  }

  setVideo($video: HTMLVideoElement) {
    if (!this.stream) {
      console.error('stream is not loaded');
      return;
    }
    $video.srcObject = this.stream;
    this._$video = $video;
  }

  stopVideo() {
    if (!this._$video) return;

    this.deleteStream();
    this._$video.pause();
    this._$video.srcObject = null;
    this._$video = null;
  }
}
