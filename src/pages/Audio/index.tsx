import React, { useCallback, useRef } from "react";
import Visualizer from "../../../packages/Visualizer";
import { fetchAudio } from "../../../packages/fetchFiles";

const AudioPage: React.FC = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const visualizer = new Visualizer();

  const onPlayAudio = useCallback(() => {
    visualizer.start(({ $canvas, times, frequencyBinCount}) => {
      console.log(times.reduce((acc, cur) => acc + cur));
      const $gl = $canvas.getContext('2d')
      console.log($gl);
      
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
    },{
      $canvas: $canvas.current!
    });
  },[]);

  const onOpenAudio = useCallback(async () => {
    const { files } = await fetchAudio()
    const buffer = await files[0].arrayBuffer()
    visualizer.setAudio(buffer);
  },[]);

  const onStopAudio = useCallback(() => {
    visualizer.stop();
  },[]);

  return (
    <div className="audio-page">
      <p>
        <button type='button' onClick={onOpenAudio}>
          audio file vis
        </button>
        <button type='button' onClick={onPlayAudio}>
          play vis
        </button>
        <button type='button' onClick={onStopAudio}>
          stop vis
        </button>
      </p>
      <canvas id="canvas" ref={$canvas}></canvas>
    </div>
  )
};

export default AudioPage;
