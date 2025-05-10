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

export type RenderCallBack = (props: {
  $canvas: HTMLCanvasElement;
  frequencyBinCount: number;
  timeDomainArray: Uint8Array;
  spectrumArray: Uint8Array;
  timeDomainRawArray: Float32Array;
  spectrumRawArray: Float32Array;
}) => void;

export type RenderOptions = {
  $canvas?: HTMLCanvasElement;
  canvasWidth?: number;
  canvasHeight?: number;
  smoothingTimeConstant?: number;
  fftSize?: number;
};
