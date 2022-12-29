import React, { useCallback, useRef } from "react";
import Visualizer from "../../../packages/Visualizer";
import { fetchAudio } from "../../../packages/fetchFiles";
import { basicParticle } from "./Mic/animation";

const AudioPage: React.FC = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const visualizer = new Visualizer();

  const onPlayAudio = useCallback(() => {
    visualizer.start(({ $canvas, times, frequencyBinCount}) => {
      basicParticle({ $canvas, times, frequencyBinCount });
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
