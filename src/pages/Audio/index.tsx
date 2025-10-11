import React, { useCallback, useRef } from 'react';
import { Visualizer } from '../../../utils/Visualizer';
import { fetchFiles } from '../../../utils/file';
import { basicParticle } from './Mic/animation';

const fetchAudio = async () =>
  fetchFiles({ accept: 'audio/*', isMultiple: false });

const AudioPage: React.FC = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const visualizer = new Visualizer();

  const onPlayAudio = useCallback(async () => {
    const { files } = await fetchAudio();
    const buffer = await files[0].arrayBuffer();
    visualizer.setAudio(buffer);
    visualizer.start(
      ({ $canvas, timeDomainArray, frequencyBinCount }) => {
        basicParticle({ $canvas, timeDomainArray, frequencyBinCount });
      },
      {
        $canvas: $canvas.current!,
      },
    );
  }, []);

  const onPauseAudio = useCallback(() => {
    visualizer.pause();
  }, []);

  const onStopAudio = useCallback(() => {
    visualizer.stop();
  }, []);

  return (
    <div className="audio-page">
      <p>
        <button type="button" onClick={onPlayAudio}>
          play vis
        </button>
        <button type="button" onClick={onPauseAudio}>
          pause vis
        </button>
        <button type="button" onClick={onStopAudio}>
          stop vis
        </button>
      </p>
      <canvas id="canvas" ref={$canvas}></canvas>
    </div>
  );
};

export default AudioPage;
