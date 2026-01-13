import React, { useCallback, useRef } from 'react';

import { fetchFiles } from '../../../../utils/file';
import { Visualizer } from '../../../../utils/Visualizer';
import { basicParticle } from '../modules/animation';

const fetchAudio = async () =>
  fetchFiles({ accept: 'audio/*', isMultiple: false });

const AudioPage: React.FC = () => {
  const $canvas = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef(new Visualizer());

  const onPlayAudio = useCallback(async () => {
    const visualizer = visualizerRef.current;
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
    visualizerRef.current.pause();
  }, []);

  const onStopAudio = useCallback(() => {
    visualizerRef.current.stop();
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
