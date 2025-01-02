export type RenderCallBack = (props: {
  $canvas: HTMLCanvasElement;
  frequencyBinCount: number;
  timeDomainArray: Uint8Array;
  spectrumArray: Uint8Array;
  timeDomainRawArray: Float32Array;
  spectrumRawArray: Float32Array;
}) => void;
