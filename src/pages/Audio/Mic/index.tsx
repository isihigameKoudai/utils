import React, { useCallback, useRef } from "react";
import Visualizer from "../../../../packages/Visualizer";
import { fetchAudio } from "../../../../packages/fetchFiles";

const MicPage: React.FC = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const micVisualizer = new Visualizer();

  const onActivateMic = useCallback(async () => {
    await micVisualizer.setDeviceAudio({ audio: true });
    micVisualizer.start(({ $canvas, times, frequencyBinCount}) => {
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
    })
  },[]);

  const onStopDeviceAudio = useCallback(() => {
    micVisualizer.stopDeviceAudio()
  },[]);

  return (
    <div className="audio-page">
       <p>
        <button type='button' onClick={onActivateMic}>
          activate mic
        </button>
        <button type='button' onClick={onStopDeviceAudio}>
          stop mic
        </button>
      </p>
      <canvas id="canvas" ref={$canvas}></canvas>
    </div>
  )
};

export default MicPage;
