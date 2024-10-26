import React, { useCallback, useRef } from "react";

import { Visualizer } from "../../../../packages/Visualizer";
import { basicParticle, lineAudio } from "./animation";

const MicPage: React.FC = () => {
  const $particle = useRef<HTMLCanvasElement>(null!);
  const $lineAudio = useRef<HTMLCanvasElement>(null!);

  const particleVisualizer = new Visualizer();
  const lineVisualizer = new Visualizer();
  const onActivateMic = useCallback(async () => {
    await particleVisualizer.getAudioStream()
    particleVisualizer.start(({ $canvas, timeDomainArray, frequencyBinCount, timeDomainRawArray }) => {
      basicParticle({ $canvas, timeDomainArray, frequencyBinCount });
    },{
      $canvas: $particle.current!,
      smoothingTimeConstant: 0.1
    });

    await lineVisualizer.getAudioStream();
    lineVisualizer.start(({ $canvas, timeDomainRawArray, spectrumRawArray }) => {
      lineAudio({ $canvas, timeDomainRawArray, spectrumRawArray, analyzer: lineVisualizer.analyzer! })
    },{
      $canvas: $lineAudio.current!,
    });
  },[]);

  const onStopDeviceAudio = useCallback(() => {
    particleVisualizer.stop();
    lineVisualizer.stop();
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
      <p>particle animation</p>
      <canvas ref={$particle}></canvas>
      <p>timeDomain and spectrum</p>
      <canvas ref={$lineAudio}></canvas>
    </div>
  )
};

export default MicPage;
