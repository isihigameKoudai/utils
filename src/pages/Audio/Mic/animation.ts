type Props = {
  $canvas: HTMLCanvasElement;
  frequencyBinCount: number;
  times: Uint8Array;
};

export const basicParticle = ({ $canvas, frequencyBinCount, times }: Props) => {
  const $gl = $canvas.getContext("2d");
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const barWidth = cw / frequencyBinCount;

  $gl!.fillStyle = "rgba(0, 0, 0, 1)";
  $gl!.fillRect(0, 0, cw, ch);

  // analyserNode.frequencyBinCountはanalyserNode.fftSize / 2の数値。よって今回は1024。
  for (let i = 0; i < frequencyBinCount; ++i) {
    const value = times[i]; // 波形データ 0 ~ 255までの数値が格納されている。
    const percent = value / 255; // 255が最大値なので波形データの%が算出できる。
    const height = ch * percent; // %に基づく高さを算出
    const offset = ch - height; // y座標の描画開始位置を算出

    $gl!.fillStyle = "#fff";
    $gl!.fillRect(i * barWidth, offset, barWidth, 2);
  }
};

export const renderLineVertex = `#version 330

void main()
{
gl_Position = vec4(0.25 * position, 1.0);
}
`;

export const renderLineFragment = `
out vec4 FragColor;
void main(void) {
  FlagColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

type LineAUdioProps = Props & {
  analyzer: AnalyserNode;
};

export const lineAudio = ({
  $canvas,
  frequencyBinCount,
  times,
  analyzer,
}: LineAUdioProps) => {
  const $gl = $canvas.getContext("2d");
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const barWidth = cw / frequencyBinCount;
};
